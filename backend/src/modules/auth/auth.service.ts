import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: any) {
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        name: dto.name,
        phone: dto.phone,
        role: dto.role || 'USER',
      },
    });

    return this.signToken(user.id, user.email, user.role);
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials!');

    return this.signToken(user.id, user.email, user.role);
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully!' };
  }

  private signToken(userId: string, email: string, role: any) {
    return {
      access_token: this.jwtService.sign({ sub: userId, email, role }),
      user: { id: userId, email, role },
    };
  }
}