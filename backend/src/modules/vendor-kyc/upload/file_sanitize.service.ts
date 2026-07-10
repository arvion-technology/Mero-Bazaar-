import { Injectable } from "@nestjs/common";
import sharp from 'sharp';
import * as fs from 'fs/promises';

@Injectable()
export class FileSanitizeService {
  async sanitizeImage(inputPath: string, outputPath: string): Promise<void> {
    await sharp(inputPath)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    await this.safeUnlink(inputPath);
  }

  private async safeUnlink(filePath: string, retries = 5, delayMs = 100): Promise<void> {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await fs.unlink(filePath);
        return;
      } catch (err: any) {
        const isLastAttempt = attempt === retries - 1;
        if (err.code === 'EPERM' && !isLastAttempt) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        console.warn(`Failed to delete quarantine file ${filePath} after ${attempt + 1} attempt(s):`, err.message);
        return;
      }
    }
  }
}