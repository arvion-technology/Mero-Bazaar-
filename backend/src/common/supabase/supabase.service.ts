import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async uploadFile(filePath: string, file: Buffer) {
    const { data, error } = await this.supabase.storage
      .from('kyc-private')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Supabase upload failed: ${error.message}`,
      );
    }

    return data;
  }

  async getSignedUrl(filePath: string) {
    const { data, error } = await this.supabase.storage
      .from('kyc-private')
      .createSignedUrl(filePath, 60 * 10); 

    if (error) {
      throw new InternalServerErrorException(
        `Failed to generate signed URL: ${error.message}`,
      );
    }

    return data.signedUrl;
  }
}