import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { UpdatePasswordDto } from './dto/update_password.dto';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

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

//forgot password
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (!user || !user.password) return { message: 'If that email exists, a link has been sent.'};

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 1000 * 60 * 60);

    await this.prisma.user.update({
      where: { email },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass:process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"HamroNepal Bazaar" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Password Reset Link',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });
    return { message: 'If that email exists, a link has been sent.'};
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid or expired token');

    const hash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: {id: user.id },
      data: {
        password: hash,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });
    return { message: 'Password reset successfully' };
  }
}
