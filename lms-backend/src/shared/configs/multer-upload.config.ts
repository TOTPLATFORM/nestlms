import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '../helpers/functions';
import { coreConstant } from '../helpers/coreConstant';
import { NotFoundException } from '@nestjs/common';

export const validImageUploadTypesRegex =
  /jpeg|jpg|png|gif|bmp|webp|svg|image\/svg\+xml/;
export const validVideoUploadTypesRegex = /mp4|mkv|x-matroska/;
export const maxImageUploadSize = 3 * 1024 * 1024; // 3MB
export const maxVideoUploadSize = 2000 * 1024 * 1024; // 3MB

const uploadDirectory = `./${coreConstant.FILE_DESTINATION}`;
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

export const multerUploadConfig: MulterOptions = {
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
      const isExtnameValidForVideo = validVideoUploadTypesRegex.test(
        path.extname(file.originalname).toLowerCase(),
      );
      // Check if file size exceeds the maximum allowed size
      if (
        (isExtnameValidForImage && file.size > maxImageUploadSize) ||
        (isExtnameValidForVideo && file.size > maxVideoUploadSize)
      ) {
        return callback(
          new Error('File size exceeds the maximum allowed size'),
          null,
        );
      }

      PrismaClient.myUploads
        .create({
          data: {
            user: {
              connect: { id: user.id },
            },
            fieldname: originalname,
            mimetype: mimetype,
            originalname: originalname,
            file_path: `/${coreConstant.FILE_DESTINATION}/${fileName}`,
            filename: fileName,
          },
        })
        .then((res) => {
          console.log(res, 'res');
        });

      return callback(null, fileName);
    },
  }),

  fileFilter: (request, file, callback) => {
    const isMimetypeValid = validImageUploadTypesRegex.test(file.mimetype);
    const isExtnameValid = validImageUploadTypesRegex.test(
      path.extname(file.originalname).toLowerCase(),
    );

    const isMimetypeValidVideo = validVideoUploadTypesRegex.test(file.mimetype);
    const isExtnameValidVideo = validVideoUploadTypesRegex.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (
      (isMimetypeValid && isExtnameValid) ||
      (isMimetypeValidVideo && isExtnameValidVideo)
    ) {
      return callback(null, true);
    }

    return callback(new NotFoundException('Invalid file type'), false);
  },

  // limits: {
  //   fileSize: maxImageUploadSize,
  // },
};
const maxAudioUploadSize = 5000 * 1024 * 1024; // Maximum file size (50MB) - adjust as needed
