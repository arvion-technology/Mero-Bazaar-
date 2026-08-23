<<<<<<< HEAD
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { VerificationStatus } from '@prisma/client';
import { UploadVerificationDto } from './dto/upload_verification.dto';
=======
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { VerificationStatus } from "@prisma/client";
import { UploadVerificationDto } from "./dto/upload_verification.dto";
>>>>>>> origin/aashika

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

<<<<<<< HEAD
  async upload(dto: UploadVerificationDto, doctorUserId: string) {
    // A doctor may only attach verification documents to their own medical listing.
    const medical = await this.prisma.medicalAndDental.findUnique({
      where: { id: dto.medicalId },
      include: { listing: { select: { userId: true } } },
    });

    if (!medical) {
      throw new NotFoundException('Medical listing not found');
    }
    if (medical.listing.userId !== doctorUserId) {
      throw new ForbiddenException(
        'You can only upload documents for your own medical listing',
      );
    }

=======
  async upload(dto: UploadVerificationDto) {
>>>>>>> origin/aashika
    return this.prisma.verificationDocument.create({
      data: {
        medicalId: dto.medicalId,
        filePath: dto.filePath,
        status: VerificationStatus.PENDING,
      },
    });
  }

  async approve(documentId: string) {
    const doc = await this.prisma.verificationDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
<<<<<<< HEAD
      throw new NotFoundException('Verification document not found');
=======
      throw new NotFoundException("Verification document not found");
>>>>>>> origin/aashika
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedDoc = await tx.verificationDocument.update({
        where: { id: documentId },
        data: { status: VerificationStatus.VERIFIED },
      });

      await tx.medicalAndDental.update({
        where: { id: doc.medicalId },
        data: { verificationStatus: VerificationStatus.VERIFIED },
      });

      return updatedDoc;
    });
  }

  async reject(documentId: string, reason: string) {
    const doc = await this.prisma.verificationDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
<<<<<<< HEAD
      throw new NotFoundException('Verification document not found');
=======
      throw new NotFoundException("Verification document not found");
>>>>>>> origin/aashika
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedDoc = await tx.verificationDocument.update({
        where: { id: documentId },
        data: {
          status: VerificationStatus.REJECTED,
          rejectionReason: reason,
        },
      });

      await tx.medicalAndDental.update({
        where: { id: doc.medicalId },
        data: { verificationStatus: VerificationStatus.REJECTED },
      });

      return updatedDoc;
    });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
