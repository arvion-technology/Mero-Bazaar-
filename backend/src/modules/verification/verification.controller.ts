import { Controller, Param, Patch, Post, Body, UseGuards, Request } from "@nestjs/common";
import { VerificationService } from "./verification.service";
import { JwtAuthGuard } from "../auth/jwt_auth.guards";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UserRole } from "@prisma/client";
import { UploadVerificationDto } from "./dto/upload_verification.dto";
import { RejectVerificationDto } from "./dto/reject_verification.dto";

@Controller('verification-docs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  @Roles(UserRole.DOCTOR)
  upload(@Request() req, @Body() dto: UploadVerificationDto) {
    return this.verificationService.upload(dto);
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN)
  approve(@Param('id') id: string) {
    return this.verificationService.approve(id);
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN)
  reject(@Param('id') id: string, @Body() dto: RejectVerificationDto) {
    return this.verificationService.reject(id, dto.reason);
  }
}