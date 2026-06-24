import { Controller, Delete, Param, Body, Post, Get, Patch, UseGuards, Request, Query, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { UpdateUserDto } from './dto/update_user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserService } from './user.service';
import { OAuthSyncDto } from './dto/oauth_sync.dto';
import { UpdatePasswordDto } from './dto/update_password.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }


  @UseGuards(JwtAuthGuard)
  @Patch('profile/password')
  updatePassword(@Request() req, @Body() dto: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.id, dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.userService.forgotPassword(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { token: string; newPassword: string }) {
    return this.userService.resetPassword(body.token, body.newPassword);
  }
}
