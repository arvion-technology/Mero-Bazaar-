import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

/**
 * Server-side publication gate: only a KYC-approved VENDOR (or an ADMIN) may
 * create marketplace listings. The frontend only *presents* this gate; the
 * authoritative check must live here, at the API boundary.
 */
export async function assertVerifiedSeller(
  prisma: PrismaService,
  userId: string,
): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      vendorProfile: { select: { isVerified: true } },
    },
  });

  if (!user) throw new ForbiddenException('Account not found');
  if (user.role === 'ADMIN') return;
  if (user.role !== 'VENDOR') {
    throw new ForbiddenException('Only sellers can publish listings.');
  }
  if (!user.vendorProfile?.isVerified) {
    throw new ForbiddenException(
      'Your seller verification is still pending. Complete KYC approval to publish listings.',
    );
  }
}
