// One decorator = JwtAuthGuard + RolesGuard + @Roles(...).
// Replace `@UseGuards(JwtAuthGuard)` with `@SellerOnly()` on handlers that only sellers
// (or admins) may call. Use `@DoctorOnly()` on medical provider handlers.
import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt_auth.guards';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

export const SellerOnly = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('VENDOR', 'ADMIN'),
  );

export const DoctorOnly = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('DOCTOR', 'ADMIN'),
  );
