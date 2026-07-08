import { diskStorage } from "multer";
import { extname } from 'path';
import { BadRequestException } from "@nestjs/common";
import * as crypto from 'crypto';

export const kycUploadconfig = {
    storage: diskStorage({
      destination: './uploads/kyc-quarantine',
      filename: (req, file, cb) => {
        const random = crypto.randomBytes(16).toString('hex');
        cb(null, `${random}.tmp`);
      },
    }),
    limits: { 
      fileSize: 5 * 1024 *1024,
      files: 1,
     },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png'];
        const ext = extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
            return cb(new BadRequestException(`File type ${ext} not allowed`), false);
        }
        cb(null, true);
    },
};