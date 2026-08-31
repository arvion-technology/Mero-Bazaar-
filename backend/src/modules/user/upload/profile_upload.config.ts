import { diskStorage } from 'multer';
import {
  imageFileFilter,
  serverFilename,
} from '../../../common/uploads/upload.utils';

export const profileUploadConfig = {
  storage: diskStorage({
    destination: './uploads/profile',
    filename: serverFilename,
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFileFilter,
};
