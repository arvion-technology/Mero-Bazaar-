import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PhoneOtpService } from '../otp/otp.service';
import { SubmitKycDto } from './dto/submit-kyc.dto';
import { VerificationStatus, OtpContext, Prisma } from '@prisma/client';
import { ReviewKycDto } from './dto/review-kyc.dto';
import { FileValidationService } from './upload/file_validation.service';
import { FileSanitizeService } from './upload/file_sanitize.service';
import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import { Response } from 'express';

@Injectable()
export class VendorKycService {
  constructor(
    private prisma: PrismaService,
    private phoneOtpService: PhoneOtpService,
    private fileValidationService: FileValidationService,
    private fileSanitizeService: FileSanitizeService,
  ) {}

  private async processUpload(
    file: Express.Multer.File | undefined,
    existingFilename: string | null | undefined,
  ): Promise<string | null> {
    if (!file) return existingFilename ?? null;

    await this.fileValidationService.assertRealType(file.path);

    const finalName = `${crypto.randomBytes(16).toString('hex')}.jpg`;
    const finalPath = path.join('./uploads/kyc-verified', finalName);

    await fs.mkdir('./uploads/kyc-verified', { recursive: true });
    await this.fileSanitizeService.sanitizeImage(file.path, finalPath);
    return finalName;
  }

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

    if (existing && existing.status === VerificationStatus.PENDING && existing.fullName !== '') {
      throw new BadRequestException('KYC already submitted and under review.');
    }

    if (existing && existing.status === VerificationStatus.VERIFIED) {
      throw new BadRequestException('KYC already verified.');
    }

    const phoneRecord = await this.prisma.vendorKyc.findFirst({
      where: {
        userId,
        contactNumber: dto.contactNumber,
        phoneVerified: true,
      },
    });

    if (!phoneRecord) {
      throw new BadRequestException(
        'Contact number must be verified before submitting KYC.',
      );
    }

    const panCardUrl = await this.processUpload(files.panCardUrl?.[0], existing?.panCardUrl);
    const photoUrl = await this.processUpload(files.photoUrl?.[0], existing?.photoUrl);
    const selfieWithPanUrl = await this.processUpload(files.selfieWithPanUrl?.[0], existing?.selfieWithPanUrl);

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
      phoneVerified: true,
    };

    try {
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        const target = (e.meta?.target as string[]) ?? [];
        if (target.includes('panNumber')) {
          throw new ConflictException('This PAN number is already registered.');
        }
        if (target.includes('contactNumber')) {
          throw new ConflictException('This contact number is already registered.');
        }
      }
      throw e;
    }
  }

  async sendContactOtp(
    userId: string,
    phone: string,
  ): Promise<{ message: string; alreadyVerified: boolean }> {
    if (!/^(98|97)\d{8}$/.test(phone)) {
      throw new BadRequestException('Invalid Nepal phone number.');
    }

    // block if this phone is verified on a different account
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
    });

    if (existing) {
      await this.prisma.vendorKyc.update({
        where: { userId },
        data: {
          contactNumber: phone,
          phoneVerified: false,
          phoneVerifiedAt: null,
        },
      });
    }

    await this.phoneOtpService.sendOtp(phone, OtpContext.KYC_CONTACT);
    return { message: `OTP sent to ${phone}`, alreadyVerified: false };
  }

  async verifyContactOtp(
    userId: string,
    otp: string,
    phone: string,
  ): Promise<{ message: string }> {
    if (!phone) {
      throw new BadRequestException('Phone number is required.');
    }

    await this.phoneOtpService.verifyOtp(phone, otp, OtpContext.KYC_CONTACT);
    await this.prisma.vendorKyc.upsert({
      where: { userId },
      update: {
        contactNumber: phone,
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
      },
      create: {
        userId,
        contactNumber: phone,
        phoneVerified: true,
        phoneVerifiedAt: new Date(),
        fullName: '',
        dateOfBirth: new Date(0),
        address: '',
        panNumber: null,
        bankName: '',
        account: '',
        accountHolderName: '',
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

    if (kyc.status !== VerificationStatus.PENDING) {
      throw new BadRequestException('Only pending KYC records can be reviewed.');
    }

    if (dto.status === VerificationStatus.REJECTED && !dto.rejectionReason) {
      throw new BadRequestException(
        'Rejection reason is required when rejecting KYC.',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const record = await tx.vendorKyc.update({
        where: { id: kycId },
        data: {
          status: dto.status,
          rejectionReason: dto.status === VerificationStatus.REJECTED ? dto.rejectionReason : null,
          reviewedAt: new Date(),
          reviewedBy: adminId,
        },
      });

      if (dto.status === VerificationStatus.VERIFIED) {
        await tx.vendorProfile.update({
          where: { userId: kyc.userId },
          data: { isVerified: true, isOnProbation: false },
        });
      }

      return record;
    });

    return {
      message: `KYC ${dto.status.toLowerCase()} successfully.`,
      kyc: updated,
    };
  }

  async getStats() {
  const [total, verified, pending, rejected] = await Promise.all([
    this.prisma.vendorKyc.count(),
    this.prisma.vendorKyc.count({ where: { status: VerificationStatus.VERIFIED } }),
    this.prisma.vendorKyc.count({ where: { status: VerificationStatus.PENDING } }),
    this.prisma.vendorKyc.count({ where: { status: VerificationStatus.REJECTED } }),
  ]);
  return { total, verified, pending, rejected };
}

  async getKycById(kycId: string) {
    const kyc = await this.prisma.vendorKyc.findUnique({
      where: { id: kycId },
      include: { user: { select: { email: true, name: true } } },
    });
    if (!kyc) throw new NotFoundException('KYC not found.');
    return kyc;
  }

  async streamDocument(filename: string, res: Response) {
    const safeName = path.basename(filename); 
    const filePath = path.join(process.cwd(), 'uploads', 'kyc-verified', safeName);

    console.log("filename:", filename);
    console.log("filePath:", filePath);

    try {
      await fs.access(filePath);
      console.log("File exists");
    } catch (e) {
      console.log("File NOT found");
      throw new NotFoundException('Document not found.');
    }

    return res.sendFile(filePath);
  }

  //patching rejected documents
  async streamOwnDocument(userId: string, filename: string, res: Response) {
  const kyc = await this.prisma.vendorKyc.findUnique({ where: { userId } });
  if (!kyc) throw new NotFoundException('KYC not found.');

  const owned = [kyc.panCardUrl, kyc.photoUrl, kyc.selfieWithPanUrl].includes(filename);
  if (!owned) {
    console.log('Doc not found', { filename, panCardUrl: kyc.panCardUrl, photoUrl: kyc.photoUrl, selfiewithPanUrl: kyc.selfieWithPanUrl });
    throw new NotFoundException('Document not found.');
  }
  return this.streamDocument(filename, res);
}
}