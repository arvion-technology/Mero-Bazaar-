import { Body, Controller, Get, Param, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AdminUserService } from './admin-user.service';
import { UserRole } from '@prisma/client';


@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUserController {
  constructor(private adminUserService: AdminUserService) {}

  @Get()
  listUsers(@Query('role') role?: UserRole) {
    return this.adminUserService.listUsers(role);
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.adminUserService.getUsersById(id);
  }

  @Patch(':id/status')
  setActive(
    @Param('id') id: string,
    @Request() req,
    @Body('isActive') isActive: boolean,    
  ) {
    return this.adminUserService.setActive(id, req.user.id, isActive);
  }
}
