<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
=======
import { Injectable } from "@nestjs/common";
>>>>>>> origin/aashika
import sharp from 'sharp';
import * as fs from 'fs/promises';

@Injectable()
export class FileSanitizeService {
  async sanitizeImage(inputPath: string, outputPath: string): Promise<void> {
    await sharp(inputPath)
      .rotate()
<<<<<<< HEAD
      .resize({
        width: 2000,
        height: 2000,
        fit: 'inside',
        withoutEnlargement: true,
      })
=======
      .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
>>>>>>> origin/aashika
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    await this.safeUnlink(inputPath);
  }

<<<<<<< HEAD
  private async safeUnlink(
    filePath: string,
    retries = 5,
    delayMs = 100,
  ): Promise<void> {
=======
  private async safeUnlink(filePath: string, retries = 5, delayMs = 100): Promise<void> {
>>>>>>> origin/aashika
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
<<<<<<< HEAD
        console.warn(
          `Failed to delete quarantine file ${filePath} after ${attempt + 1} attempt(s):`,
          err.message,
        );
=======
        console.warn(`Failed to delete quarantine file ${filePath} after ${attempt + 1} attempt(s):`, err.message);
>>>>>>> origin/aashika
        return;
      }
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/aashika
