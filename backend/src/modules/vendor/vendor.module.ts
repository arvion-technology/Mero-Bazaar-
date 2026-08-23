import { Module } from '@nestjs/common';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VendorController],
<<<<<<< HEAD
  providers: [VendorService],
})
export class VendorModule {}
=======
  providers: [VendorService]
})
export class VendorModule {}

>>>>>>> origin/aashika
