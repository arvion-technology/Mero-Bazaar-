import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';

@Module({
  imports: [PrismaModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
<<<<<<< HEAD
export class VerificationModule {}
=======
export class VerificationModule {}
>>>>>>> origin/aashika
