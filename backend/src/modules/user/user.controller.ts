import {
  Controller,
  Delete,
  Param,
  Body,
  Post,
  Get,
  Patch,
  UseGuards,
  Request,
  Query,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
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
import { ActivityLogService } from './activity_log.service';
import { InternalAuthGuard } from '../auth/internal_auth.guard';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-email')
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return { id: user.id, role: user.role };
  }

  @UseGuards(InternalAuthGuard)
  @Post('oauth-sync')
  async oauthSync(@Body() dto: OAuthSyncDto) {
    return this.userService.findOrCreateOAuthUser(dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto.token, dto.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/activity')
  getActivityLog(@Request() req) {
    return this.activityLogService.list(req.user.id);
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
    return this.userService.updatePassword(
      req.user.id,
      dto,
      req.user.sessionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/phone/request')
  requestPhoneUpdate(
    @Request() req,
    @Body('phone') phone: string,
    @Body('currentPassword') currentPassword?: string,
    @Body('otp') otp?: string,
  ) {
    return this.userService.requestPhoneUpdate(
      req.user.id,
      phone,
      currentPassword,
      otp,
    );
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
  disableTwoFactor(
    @Request() req,
    @Body('currentPassword') currentPassword?: string,
    @Body('otp') otp?: string,
  ) {
    return this.userService.disableTwoFactor(req.user.id, currentPassword, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/me')
  removeSelf(
    @Request() req,
    @Body('currentPassword') currentPassword?: string,
    @Body('otp') otp?: string,
  ) {
    return this.userService.removeSelf(req.user.id, currentPassword, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/photo')
  @UseInterceptors(FileInterceptor('image', profileUploadConfig))
  async uploadProfilePhoto(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return await this.userService.updateProfileImage(req.user.id, file);
    } catch (err) {
      // Multer already wrote the temp file — never leave an orphan behind.
      if (file?.path) {
        const { unlink } = await import('fs/promises');
        await unlink(file.path).catch(() => {});
      }
      throw err;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
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
