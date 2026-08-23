import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Module({
<<<<<<< HEAD
  imports: [ConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
=======
  imports: [ConfigModule], 
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
>>>>>>> origin/aashika
