import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { AdminListingController } from './admin-listing.controller';
import { AdminListingService } from './admin-listing.service';


@Module({
  imports: [PrismaModule],
  controllers: [AdminUserController, AdminListingController],
  providers: [AdminUserService, AdminListingService],
})
export class AdminModule {}