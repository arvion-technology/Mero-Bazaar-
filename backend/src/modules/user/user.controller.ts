import { Controller, Delete, Param, Body, Post, Get, Patch, UseGuards, Request, Query, NotFoundException, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { UpdateUserDto } from './dto/update_user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserService } from './user.service';
import { OAuthSyncDto } from './dto/oauth_sync.dto';
import { UpdatePasswordDto } from './dto/update_password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { profileUploadConfig } from './upload/profile_upload.config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('by-email')
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, role: user.role };
  }

  @Post('oauth-sync')
  async oauthSync(@Body() dto: OAuthSyncDto) {
    return this.userService.findOrCreateOAuthUser(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.userService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    console.log('reset-password hit, body:', body);
    return this.userService.resetPassword(body.token, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  getMyProfile(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/me')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/password')
  updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/phone/request')
  requestPhoneUpdate(@Request() req, @Body('phone') phone: string) {
    return this.userService.requestPhoneUpdate(req.user.id, phone);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/phone/confirm')
  confirmPhoneUpdate(@Request() req, @Body('otp') otp: string) {
    return this.userService.confirmPhoneUpdate(req.user.id, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  requestEnableTwoFactor(@Request() req) {
    return this.userService.requestEnableTwoFactor(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/confirm')
  confirmEnableTwoFactor(@Request() req, @Body('otp') otp: string) {
    return this.userService.confirmEnableTwoFactor(req.user.id, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  disableTwoFactor(@Request() req) {
    return this.userService.disableTwoFactor(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/me')
  removeSelf(@Request() req) {
    return this.userService.remove(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/photo')
  @UseInterceptors(FileInterceptor('image', profileUploadConfig))
  uploadProfilePhoto(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateProfileImage(req.user.id, file);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}