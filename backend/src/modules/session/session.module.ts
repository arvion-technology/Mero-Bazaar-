import { Module } from '@nestjs/common';
import { SessionsController } from './session.controller';
import { SessionsService } from './session.service';
import { PrismaModule } from 'src/database/prisma.module'; // adjust to your actual module name/path
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}