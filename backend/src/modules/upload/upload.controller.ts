import {
  Controller, Post, UseInterceptors, UploadedFile, Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':folder')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    const url = await this.uploadService.uploadFile(file, folder);
    return { url };
  }
}
