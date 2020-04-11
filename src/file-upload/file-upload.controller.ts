import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
const MulterGoogleStorage = require('multer-google-storage');

//TODO: finish interfaces
//TODO: find solution for multer-google-storage import
@Controller('file')
export class FileUploadController {
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('file', 1, {
      storage: MulterGoogleStorage.storageEngine({
        projectId: process.env.GOOGLE_PROJECT_ID,
        keyFilename: 'src/constants/storage.json',
        bucket: process.env.GOOGLE_STORAGE_BUCKET_NAME,
        fileName: (req, file, cb) => {
          const fileNamesplit = file.originalName.split('.');
          const ext = fileNamesplit[fileNamesplit.length - 1];
          cb(null, `${Date.now()}.${ext}`);
        },
      }),
    }),
  )
  public async save(@UploadedFiles() file: any) {
    console.log(file);
    return '';
  }
}
