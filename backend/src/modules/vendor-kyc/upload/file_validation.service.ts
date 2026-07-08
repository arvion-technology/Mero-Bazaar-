import { BadRequestException, Injectable } from "@nestjs/common";
import { fileTypeFromFile } from "file-type";

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png']);

@Injectable()
export class FileValidationService {
  async assertRealType(path: string): Promise<string> {
    const detected = await fileTypeFromFile(path);
    if (!detected || !ALLOWED_MIME.has(detected.mime)) {
        throw new BadRequestException('File content does not match an allowed image type (JPEG or PNG).',          
    );
    }
    return detected.mime;
  }
}