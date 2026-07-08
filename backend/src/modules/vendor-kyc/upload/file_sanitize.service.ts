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

  await fs.unlink(inputPath);
  }
}