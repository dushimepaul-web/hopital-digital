import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) throw new BadRequestException('No file provided');

    const provider = this.configService.get<string>('STORAGE_PROVIDER', 'local');

    if (provider === 'local') {
      return this.saveLocal(file, folder);
    }

    if (provider === 'cloudinary') {
      return this.uploadToCloudinary(file, folder);
    }

    throw new BadRequestException('Invalid storage provider');
  }

  private async saveLocal(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadDir = path.join('uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, file.buffer);

    return `/${filepath}`;
  }

  private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<string> {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `hopital-digital/${folder}` },
        (err, result) => {
          if (err) reject(new BadRequestException('Upload to Cloudinary failed'));
          else resolve(result.secure_url);
        },
      );
      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    if (fileUrl.startsWith('/uploads/')) {
      const filepath = path.join(process.cwd(), fileUrl);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
  }
}
