import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';

@Module({
    imports: [PrismaModule],
    controllers: [AdminUserController],
    providers: [AdminUserService],
})
export class AdminUserModule {}
