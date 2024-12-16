import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '../helpers/functions';
import { coreConstant } from '../helpers/coreConstant';
import { NotFoundException } from '@nestjs/common';

export const validImageUploadTypesRegex = /jpeg|jpg|png|gif|bmp|webp/;

export const maxImageUploadSize = 3 * 1024 * 1024; // 3MB

const uploadDirectory = `./${coreConstant.WITHDRAW_FILE_DESTINATION}`;
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

export const fileUploadConfig: MulterOptions = {
  storage: diskStorage({
    destination: uploadDirectory,
    filename: (request, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const user: any = request.user;
      const { originalname, mimetype } = file;
      const fileName = `${uniqueSuffix}-${file.originalname}`;

      const isExtnameValidForImage = validImageUploadTypesRegex.test(
        path.extname(file.originalname).toLowerCase(),
      );

      // Check if file size exceeds the maximum allowed size
      if (isExtnameValidForImage && file.size > maxImageUploadSize) {
        return callback(
          new Error('File size exceeds the maximum allowed size'),
          null,
        );
      }

      return callback(null, fileName);
    },
  }),

  fileFilter: (request, file, callback) => {
    const isMimetypeValid = validImageUploadTypesRegex.test(file.mimetype);
    const isExtnameValid = validImageUploadTypesRegex.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (isMimetypeValid && isExtnameValid) {
      return callback(null, true);
    }

    return callback(new NotFoundException('Invalid file type'), false);
  },

  // limits: {
  //   fileSize: maxImageUploadSize,
  // },
};
