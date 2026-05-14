import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class VerificationService {
  constructor(private prisma: PrismaService) {}

  async approve(id: string) {
    return this.prisma.medicalAndDental.update({
      where: { id },
      data: {
        verification_status: 'VERIFIED',
        isVerified: true,
        nmcBadge: true,
      },
    });
  }
}