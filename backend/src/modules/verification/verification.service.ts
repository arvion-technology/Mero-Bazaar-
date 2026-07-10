import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { VerificationStatus } from "@prisma/client";
import { UploadVerificationDto } from "./dto/upload_verification.dto";

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async upload(dto: UploadVerificationDto) {
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
      throw new NotFoundException("Verification document not found");
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
      throw new NotFoundException("Verification document not found");
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
}