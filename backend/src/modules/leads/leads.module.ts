import { Module } from '@nestjs/common';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
