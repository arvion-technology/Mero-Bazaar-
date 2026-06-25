import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PhoneOtpService } from '../otp/otp.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { VerificationStatus, OtpContext } from '@prisma/client';
import { ReviewKycDto } from './dto/review-kyc.dto';
 
@Injectable()
export class VendorKycService {
  constructor(
    private prisma: PrismaService,
    private phoneOtpService: PhoneOtpService,
  ) {}
 
  async submitKyc(
    userId: string,
    dto: SubmitKycDto,
    files: {
      panCardUrl?: Express.Multer.File[];
      photoUrl?: Express.Multer.File[];
      selfieWithPanUrl?: Express.Multer.File[];
    },
  ) {
    const existing = await this.prisma.vendorKyc.findUnique({
      where: { userId },
    });
 
    if (existing && existing.status === VerificationStatus.PENDING) {
      throw new BadRequestException('KYC already submitted and under review.');
    }
 
    if (existing && existing.status === VerificationStatus.VERIFIED) {
      throw new BadRequestException('KYC already verified.');
    }
 
    if (!existing?.phoneVerified) {
      throw new BadRequestException(
        'Contact number must be verified before submitting KYC.',
      );
    }
 
    if (existing.contactNumber !== dto.contactNumber) {
      throw new BadRequestException(
        'Contact number does not match the verified number.',
      );
    }
 
    const panCardUrl = files.panCardUrl?.[0]?.path ?? existing?.panCardUrl;
    const photoUrl = files.photoUrl?.[0]?.path ?? existing?.photoUrl;
    const selfieWithPanUrl =
      files.selfieWithPanUrl?.[0]?.path ?? existing?.selfieWithPanUrl;
 
    const data = {
      userId,
      fullName: dto.fullName,
      dateOfBirth: new Date(dto.dateOfBirth),
      contactNumber: dto.contactNumber,
      address: dto.address,
      panNumber: dto.panNumber,
      bankName: dto.bankName,
      account: dto.account,
      accountHolderName: dto.accountHolderName,
      panCardUrl,
      photoUrl,
      selfieWithPanUrl,
      status: VerificationStatus.PENDING,
    };
 
    const kyc = await this.prisma.vendorKyc.upsert({
      where: { userId },
      create: data,
      update: {
        ...data,
        rejectionReason: null,
        reviewedAt: null,
        reviewedBy: null,
      },
    });
 
    return { message: 'KYC submitted successfully.', kyc };
  }
 
  async sendContactOtp(
    userId: string,
    phone: string,
  ): Promise<{ message: string; alreadyVerified: boolean }> {
    if (!/^(98|97)\d{8}$/.test(phone)) {
      throw new BadRequestException('Invalid Nepal phone number.');
    }
 
    const takenByOther = await this.prisma.vendorKyc.findFirst({
      where: {
        contactNumber: phone,
        phoneVerified: true,
        NOT: { userId },
      },
    });
    if (takenByOther) {
      throw new ConflictException(
        'This phone number is already verified on another account.',
      );
    }
 
    const existing = await this.prisma.vendorKyc.findUnique({
      where: { userId },
      select: { contactNumber: true, phoneVerified: true },
    });
 
    if (existing?.phoneVerified && existing.contactNumber === phone) {
      return { message: 'Phone already verified.', alreadyVerified: true };
    }
 
    await this.prisma.vendorKyc.upsert({
      where: { userId },
      update: {
        contactNumber: phone,
        phoneVerified: false,
        phoneVerifiedAt: null,
      },
      create: {
        userId,
        contactNumber: phone,
        phoneVerified: false,
        fullName: '',
        dateOfBirth: new Date(0),
        address: '',
        panNumber: '',
        bankName: '',
        account: '',
        accountHolderName: '',
      },
    });
 
    await this.phoneOtpService.sendOtp(phone, OtpContext.KYC_CONTACT);
    return { message: `OTP sent to ${phone}`, alreadyVerified: false };
  }
 
  async verifyContactOtp(
    userId: string,
    otp: string,
  ): Promise<{ message: string }> {
    const kyc = await this.prisma.vendorKyc.findUnique({
      where: { userId },
      select: { contactNumber: true, phoneVerified: true },
    });
 
    if (!kyc?.contactNumber) {
      throw new BadRequestException(
        'No pending phone verification. Request OTP first.',
      );
    }
 
    if (kyc.phoneVerified) {
      throw new BadRequestException('Phone already verified.');
    }
 
    await this.phoneOtpService.verifyOtp(
      kyc.contactNumber,
      otp,
      OtpContext.KYC_CONTACT,
    );
 
    await this.prisma.vendorKyc.update({
      where: { userId },
      data: {
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
      },
    });
 
    return { message: 'Contact number verified successfully.' };
  }
 
  async getMyKyc(userId: string) {
    const kyc = await this.prisma.vendorKyc.findUnique({ where: { userId } });
    if (!kyc) throw new NotFoundException('KYC not submitted yet.');
    return kyc;
  }
 
  async getAllKyc(status?: VerificationStatus) {
    return this.prisma.vendorKyc.findMany({
      where: status ? { status } : undefined,
      include: { user: { select: { email: true, name: true } } },
      orderBy: { submittedAt: 'desc' },
    });
  }
 
  async reviewKyc(kycId: string, adminId: string, dto: ReviewKycDto) {
    const kyc = await this.prisma.vendorKyc.findUnique({ where: { id: kycId } });
    if (!kyc) throw new NotFoundException('KYC not found.');
 
    if (
      dto.status === VerificationStatus.REJECTED &&
      !dto.rejectionReason
    ) {
      throw new BadRequestException(
        'Rejection reason is required when rejecting KYC.',
      );
    }
 
    const updated = await this.prisma.vendorKyc.update({
      where: { id: kycId },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason ?? null,
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
    });
 
    if (dto.status === VerificationStatus.VERIFIED) {
      await this.prisma.vendorProfile.update({
        where: { userId: kyc.userId },
        data: { isVerified: true },
      });
    }
 
    return {
      message: `KYC ${dto.status.toLowerCase()} successfully.`,
      kyc: updated,
    };
  }
}
 
