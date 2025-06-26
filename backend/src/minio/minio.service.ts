import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.client = new Client({
      endPoint: config.get('MINIO_ENDPOINT') as string,
      port: +config.get('MINIO_PORT'),
      useSSL: config.get('MINIO_USE_SSL') === 'true',
      accessKey: config.get('MINIO_ACCESS_KEY') as string,
      secretKey: config.get('MINIO_SECRET_KEY') as string,
    });
    this.bucket = config.get('MINIO_BUCKET') as string;
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket, '');
    }
  }

  getPresignedUrl(objectName: string, expires = 24*60*60) {
    return this.client.presignedPutObject(this.bucket, objectName, expires);
  }

  getPresignedGetUrl(objectName: string, expires = 24*60*60) {
    return this.client.presignedGetObject(this.bucket, objectName, expires);
  }

  getObjectStream(objectName: string) {
    return this.client.getObject(this.bucket, objectName);
  }
}