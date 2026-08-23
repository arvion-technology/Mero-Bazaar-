import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface VerifiedPayment {
  verified: boolean;
  providerAmount: number;
  providerRef: string;
}

@Injectable()
export class PaymentVerificationService {
  private readonly logger = new Logger(PaymentVerificationService.name);

  private readonly esewaStatusUrl =
    process.env.ESEWA_STATUS_CHECK_URL ??
    'https://epay.esewa.com.np/api/epay/transaction/status/';
  private readonly esewaProductCode = process.env.ESEWA_PRODUCT_CODE!;

  private readonly khaltiLookupUrl =
<<<<<<< HEAD
    process.env.KHALTI_LOOKUP_URL ??
    'https://khalti.com/api/v2/epayment/lookup/';
  private readonly khaltiSecretKey = process.env.KHALTI_SECRET_KEY!;

  async verifyEsewa(
    transactionUuid: string,
    expectedAmount: number,
  ): Promise<VerifiedPayment> {
=======
    process.env.KHALTI_LOOKUP_URL ?? 'https://khalti.com/api/v2/epayment/lookup/';
  private readonly khaltiSecretKey = process.env.KHALTI_SECRET_KEY!;

  async verifyEsewa(transactionUuid: string, expectedAmount: number): Promise<VerifiedPayment> {
>>>>>>> origin/aashika
    try {
      const { data } = await axios.get(this.esewaStatusUrl, {
        params: {
          product_code: this.esewaProductCode,
          total_amount: expectedAmount,
<<<<<<< HEAD
          transaction_uuid: transactionUuid,
=======
          transaction_uuid: transactionUuid, 
>>>>>>> origin/aashika
        },
        timeout: 8000,
      });

      const providerAmount = Number(data?.total_amount);
      const verified =
        data?.status === 'COMPLETE' &&
        Math.abs(providerAmount - expectedAmount) < 0.01 &&
        typeof data?.ref_id === 'string' &&
        data.ref_id.length > 0;

<<<<<<< HEAD
      return {
        verified,
        providerAmount,
        providerRef: data?.ref_id ?? transactionUuid,
      };
    } catch (err) {
      this.logger.error(
        `eSewa verification failed for ${transactionUuid}`,
        err?.message,
      );
=======
      return { verified, providerAmount, providerRef: data?.ref_id ?? transactionUuid };
    } catch (err) {
      this.logger.error(`eSewa verification failed for ${transactionUuid}`, err?.message);
>>>>>>> origin/aashika
      throw new BadGatewayException('Unable to verify payment with eSewa.');
    }
  }

<<<<<<< HEAD
  async verifyKhalti(
    pidx: string,
    expectedAmount: number,
  ): Promise<VerifiedPayment> {
=======
  async verifyKhalti(pidx: string, expectedAmount: number): Promise<VerifiedPayment> {
>>>>>>> origin/aashika
    try {
      const { data } = await axios.post(
        this.khaltiLookupUrl,
        { pidx },
        {
          headers: { Authorization: `Key ${this.khaltiSecretKey}` },
          timeout: 8000,
        },
      );

      const providerAmountRupees = Number(data?.total_amount) / 100;
      const verified =
        data?.status === 'Completed' &&
        Math.abs(providerAmountRupees - expectedAmount) < 0.01 &&
        typeof data?.transaction_id === 'string' &&
        data.transaction_id.length > 0;

<<<<<<< HEAD
      return {
        verified,
        providerAmount: providerAmountRupees,
        providerRef: data?.transaction_id ?? pidx,
      };
=======
      return { verified, providerAmount: providerAmountRupees, providerRef: data?.transaction_id ?? pidx };
>>>>>>> origin/aashika
    } catch (err) {
      this.logger.error(`Khalti verification failed for ${pidx}`, err?.message);
      throw new BadGatewayException('Unable to verify payment with Khalti.');
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
