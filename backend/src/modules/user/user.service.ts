import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update_password.dto';

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
      ? existing 
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
          select: { id: true, email: true, role: true, phone: true, address: true, image: true, name: true },
        });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { id: user.id, role: user.role, phone: user.phone, address: user.address, image: user.image, name: user.name, accessToken };
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
        image: true,
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
          image: true,
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

async updatePassword(id: string, dto: UpdatePasswordDto) {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: { id: true, password: true },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (!user.password) {
    // user signed up via OAuth and has no password set yet
    throw new UnauthorizedException('Password login is not enabled for this account');
  }

  const isValid = await bcrypt.compare(dto.currentPassword, user.password);
  if (!isValid) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  const newHash = await bcrypt.hash(dto.newPassword, 12);

  await this.prisma.user.update({
    where: { id },
    data: { password: newHash },
  });

  return { message: 'Password updated successfully' };
}
}
