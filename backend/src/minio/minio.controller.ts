import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { MinioService } from './minio.service';
import { Response } from 'express';

@Controller('images')
export class MinioController {
  constructor(private readonly minio: MinioService) {}

  // POST /images/presign → { url, key }
  @Post('presign')
  async presign(@Body('filename') filename: string) {
    const key = `${Date.now()}_${filename}`;
    const url = await this.minio.getPresignedUrl(key);
    return { url, key };
  }

  // GET /images/presign/:key → { url }
  @Get('presign/:key')
  async presignGet(@Param('key') key: string) {
    const url = await this.minio.getPresignedGetUrl(key);
    return { url };
  }

  // GET /images/:key → proxy the object
  @Get(':key')
  async getObject(@Param('key') key: string, @Res() res: Response) {
    const stream = await this.minio.getObjectStream(key);
    stream.pipe(res);
  }
}