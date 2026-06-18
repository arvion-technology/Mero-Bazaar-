import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    if(dto.phone) {
      const phoneExists = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (phoneExists) throw new ConflictException('Phone number already in use');
    }
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        phone: dto.phone,
        role: dto.role ?? UserRole.USER,
        address: dto.address,

        ...(dto.role === UserRole.VENDOR && {
          vendorProfile: {
            create: {
              businessName: dto.name ?? '',
              businessType: 'INDIVIDUAL',
            },
          },
        }),
      },
    });

    return this.signToken(user.id, user.email, user.role ?? UserRole.USER);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials!');

    return this.signToken(user.id, user.email, user.role ?? UserRole.USER);
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
    return { message: 'Logged out successfully!' };
  }

  private signToken(userId: string, email: string, role: UserRole) {
    return {
      access_token: this.jwtService.sign({ sub: userId, email, role }),
      user: { id: userId, email, role },
    };
  }
}