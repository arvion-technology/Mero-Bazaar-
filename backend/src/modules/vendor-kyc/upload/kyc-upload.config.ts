import { diskStorage } from "multer";
import { extname } from 'path';
import { BadRequestException } from "@nestjs/common";

export const kycUploadconfig = {
    storage: diskStorage({
      destination: './uploads/kyc',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    limits: { fileSize: 5 * 1024 *1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
        const ext = extname(file.originalname).toLowerCase();
        if (!allowed.includes(ext)) {
            return cb(new BadRequestException(`File type ${ext} not allowed`), false);
        }
        cb(null, true);
    },
};