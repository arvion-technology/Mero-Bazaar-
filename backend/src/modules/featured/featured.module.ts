import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { FeaturedController } from './featured.controller';
import { FeaturedService } from './featured.service';

@Module({
  imports: [PrismaModule],
  controllers: [FeaturedController],
  providers: [FeaturedService],
  exports: [FeaturedService],
})
export class FeaturedModule {}