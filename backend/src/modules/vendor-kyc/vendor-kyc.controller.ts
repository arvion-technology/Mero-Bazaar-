import { Body, Controller, Param, UploadedFiles, UseGuards, Post, Get, Patch, Query, UseInterceptors, Request } from '@nestjs/common';
import { VendorKycService } from './vendor-kyc.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { kycUploadconfig } from './upload/kyc-upload.config';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole, VerificationStatus } from '@prisma/client';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { JwtAuthGuard } from '../auth/jwt_auth.guards';
import { Roles } from '../auth/roles.decorator';

@Controller('vendor-kyc')
@UseGuards(JwtAuthGuard)
export class VendorKycController {
  constructor(private vendorKycService: VendorKycService) {}

  @Post('submit')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'panCardUrl', maxCount: 1 },
        { name: 'photoUrl', maxCount: 1 },
        { name: 'selfieWithPanUrl', maxCount: 1 },
      ],
      kycUploadconfig,
    ),
  )
  submitKyc(
    @Request() req,
    @Body() dto: SubmitKycDto,
    @UploadedFiles()
    files: {
      panCardUrl?: Express.Multer.File[];
      photoUrl?: Express.Multer.File[];
      selfieWithPanUrl?: Express.Multer.File[];
    },
  ) {
    return this.vendorKycService.submitKyc(req.user.id, dto, files);
  }

  @Post('send')
  sendOtp(@Request() req, @Body('phone') phone: string) {
    return this.vendorKycService.sendContactOtp(req.user.id, phone);
  }

  @Post('verify')
  verifyOtp(@Request() req, @Body('otp') otp: string) {
    return this.vendorKycService.verifyContactOtp(req.user.id, otp);
  }

  @Get('me')
  getMyKyc(@Request() req) {
    return this.vendorKycService.getMyKyc(req.user.id);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllKyc(@Query('status') status?: VerificationStatus) {
    return this.vendorKycService.getAllKyc(status);
  }

  @Patch('admin/review/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  reviewKyc(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: ReviewKycDto,
  ) {
    return this.vendorKycService.reviewKyc(id, req.user.id, dto);
  }
}
