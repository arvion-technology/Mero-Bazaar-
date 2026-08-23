import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { SellersService } from './seller.service';
import { SellersController } from './seller.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SellersController],
<<<<<<< HEAD
  providers: [SellersService],
=======
  providers: [SellersService]
>>>>>>> origin/aashika
})
export class SellerModule {}
