import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

//TODO: finish interfaces
//TODO: find solution for multer-google-storage import
@Controller('file')
export class FileUploadController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async save(@UploadedFile() file: any) {
    return file;
  }
}
