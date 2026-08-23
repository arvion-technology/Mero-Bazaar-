import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { ListingsModule } from 'src/modules/listings/listings.module';

@Module({
  imports: [PrismaModule, ListingsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
