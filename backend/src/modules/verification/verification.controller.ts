import { Controller, Param, Patch, Post, Body } from "@nestjs/common";
import { VerificationService } from "./verification.service";

@Controller('verification-docs')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  upload(@Body() dto: any) {
    return this.verificationService.upload(dto);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.verificationService.approve(id);
  }
}