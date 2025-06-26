declare module 'minio' {
  import type { EventEmitter } from 'events';

  export interface ClientOptions {
    endPoint: string;
    port?: number;
    useSSL?: boolean;
    accessKey: string;
    secretKey: string;
  }

  export class Client {
    constructor(options: ClientOptions);
    bucketExists(bucket: string): Promise<boolean>;
    makeBucket(bucket: string, region?: string): Promise<void>;
    presignedPutObject(bucket: string, objectName: string, expires: number): Promise<string>;
    presignedGetObject(bucket: string, objectName: string, expires: number): Promise<string>;
    getObject(bucket: string, objectName: string): Promise<NodeJS.ReadableStream>;
  }
}
