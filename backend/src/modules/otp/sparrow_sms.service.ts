//using mock data instead of sparrowsms tokens
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface SparrowSmsResponse {
  response_code: number;
  message: string;
  credits_consumed: number;
  credits_available: number;
}

@Injectable()
export class SparrowSmsService {
  private readonly logger = new Logger(SparrowSmsService.name);
  // TLS only: the provider token and OTP must never travel in plaintext.
  private readonly baseUrl = 'https://api.sparrowsms.com/v2/sms/';

  constructor(private config: ConfigService) {}

  async send(to: string, message: string): Promise<void> {
    const provider = this.config.get<string>('SMS_PROVIDER');

    const phone = this.normalizePhone(to);

    // MOCK MODE — development only. Never emit the OTP body into production logs;
    // log only the destination so log readers cannot replay codes.
    if (provider === 'mock') {
      if (process.env.NODE_ENV === 'production') {
        this.logger.log(
          `[MOCK SMS] OTP sent to ${phone} (content withheld in production)`,
        );
      } else {
        this.logger.log(`[MOCK SMS] OTP for ${phone}: ${message}`);
      }
      return;
    }

    const token = this.config.getOrThrow<string>('SPARROW_SMS_TOKEN');
    const from = this.config.getOrThrow<string>('SPARROW_SMS_FROM');

    try {
      const response = await axios.post<SparrowSmsResponse>(
        this.baseUrl,
        {
          token,
          from,
          to: phone,
          text: message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        },
      );

      const { response_code, message: resMsg } = response.data;

      if (response_code !== 200) {
        this.logger.error(
          `Sparrow SMS failed: ${resMsg} (code: ${response_code})`,
        );
        throw new InternalServerErrorException(
          'Failed to send OTP. Please try again.',
        );
      }

      this.logger.log(`SMS sent successfully to ${phone}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(`Sparrow SMS network error: ${error.message}`);
        throw new InternalServerErrorException(
          'SMS service unavailable. Try again later.',
        );
      }

      throw error;
    }
  }

  private normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.startsWith('977')) return digits;
    if (digits.startsWith('0')) return `977${digits.slice(1)}`;
    if (digits.length === 10) return `977${digits}`;

    return digits;
  }
}
