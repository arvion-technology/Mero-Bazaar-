import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        vendorProfile: true,
        doctorProfile: true,
      },
    });
  }
  
  async findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  });
 }

  async findOrCreateOAuthUser(data: {
    email: string;
    name: string;
    image?: string;
    role?: string;
  }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });

    const user = existing
      ? await this.prisma.user.update({
          where: { email: data.email },
          data: { name: data.name, image: data.image },
          select: { id: true, email: true, role: true },
        })
      : await this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            image: data.image,
            role: data.role === 'VENDOR' ? 'VENDOR' : 'USER',
            isActive: true,
            ...(data.role === 'VENDOR' && {
              vendorProfile: {
                create: { businessName: data.name ?? '', businessType: 'INDIVIDUAL' },
              },
            }),
          },
          select: { id: true, email: true, role: true },
        });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { id: user.id, role: user.role, accessToken };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        role: true,
        isActive: true,
        vendorProfile: true,
        doctorProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('That phone number is already in use');
      }
      throw err;
    }
  }
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
