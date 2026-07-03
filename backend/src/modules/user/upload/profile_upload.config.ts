import { diskStorage } from "multer";
import { extname } from 'path';
import { BadRequestException } from "@nestjs/common";

export const profileUploadConfig = {
  storage: diskStorage({
    destination: './uploads/profile',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new BadRequestException(`File type ${ext} not allowed`), false);
    }
    cb(null, true);
  },
};