import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import sharp, { type Metadata } from 'sharp';
import { Request } from 'express';

/**
 * Allowed output formats after re-encoding. Re-encoding (rather than trusting
 * the original bytes) strips any non-image payload smuggled inside a file
 * that merely has an image extension/mimetype.
 */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

/**
 * Multer fileFilter: rejects files by extension/mimetype before they're even
 * written to disk. This is a cheap first filter, NOT the security boundary —
 * validateAndReencodeImage() below does the real magic-byte check afterward.
 */
export function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new Error('Only JPEG, PNG, and WEBP image files are allowed'),
      false,
    );
  }
}

/**
 * Multer filename callback: generates a collision-resistant temp filename
 * for the initially uploaded file, before re-encoding happens.
 */
export function serverFilename(
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename: string) => void,
) {
  const ext = path.extname(file.originalname).toLowerCase();
  const uniqueSuffix = `${Date.now()}-${crypto.randomInt(1e9)}`;
  callback(null, `${uniqueSuffix}${ext}`);
}

/**
 * Verifies that a file at `filePath` is a genuine image by reading its
 * actual content (magic bytes / codec headers via Sharp's metadata probe),
 * NOT by trusting the extension or mimetype supplied by the client.
 *
 * If the content is not a genuine, decodable image, this throws AND deletes
 * the temp file at filePath, per the security-fix comment at every call site.
 *
 * On success, re-encodes the image (stripping any non-image payload or
 * embedded metadata/exploits) into `destDir` under a new filename, deletes
 * the original temp file, and returns the new filename (not a full path).
 */
export async function validateAndReencodeImage(
  filePath: string,
  destDir: string,
): Promise<string> {
  let metadata: Metadata;

  try {
    metadata = await sharp(filePath).metadata();
  } catch (err) {
    await safeDelete(filePath);
    throw new Error('Uploaded file is not a valid image');
  }

  if (!metadata.format || !['jpeg', 'png', 'webp'].includes(metadata.format)) {
    await safeDelete(filePath);
    throw new Error('Uploaded file is not a supported image format');
  }

  await fs.mkdir(destDir, { recursive: true });

  const outputExt = metadata.format === 'jpeg' ? 'jpg' : metadata.format;
  const finalName = `${Date.now()}-${crypto.randomInt(1e9)}.${outputExt}`;
  const outputPath = path.join(destDir, finalName);

  try {
    let pipeline = sharp(filePath).rotate(); // auto-orient, strips EXIF orientation quirks

    if (metadata.format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
    } else if (metadata.format === 'png') {
      pipeline = pipeline.png({ compressionLevel: 8 });
    } else if (metadata.format === 'webp') {
      pipeline = pipeline.webp({ quality: 85 });
    }

    await pipeline.toFile(outputPath);
  } catch (err) {
    await safeDelete(filePath);
    await safeDelete(outputPath);
    throw new Error('Failed to process uploaded image');
  }

  await safeDelete(filePath);

  return finalName;
}

async function safeDelete(filePath: string): Promise<void> {
  try {
    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  } catch {
    // best-effort cleanup; don't mask the original error
  }
}

/**
 * Deletes Multer's already-written temp files. Used by controllers when a
 * downstream step (authz, validation, etc.) fails AFTER Multer has written
 * files to disk but BEFORE validateAndReencodeImage() has run — otherwise
 * those temp files are silently orphaned on every rejected request.
 */
export async function removeUploadedFiles(
  files: Express.Multer.File[],
): Promise<void> {
  await Promise.all(files.map((file) => safeDelete(file.path)));
}