import { Controller, Param, Patch, Post } from "@nestjs/common";
import { VerificationService } from "./verification.service";

@Controller('verification_docs')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  upload() {
    return 'upload verification doc';
  }

  @Patch(':id')
  approve(@Param('id') id: string) {
    return this.verificationService.approve(id);
  }
}