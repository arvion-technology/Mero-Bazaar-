import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WishlistController],
<<<<<<< HEAD
  providers: [WishlistService],
=======
  providers: [WishlistService]
>>>>>>> origin/aashika
})
export class WishlistModule {}
