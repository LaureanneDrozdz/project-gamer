import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data) => this.excludePasswordFromResponse(data)));
  }

  private excludePasswordFromResponse(data: unknown): unknown {
    if (!data) return data;

    if (Array.isArray(data)) {
      return data.map((item) => this.excludePasswordFromResponse(item));
    }

    if (typeof data === 'object' && data !== null) {
      const cleanedData = { ...data };

      if ('password_hash' in cleanedData) {
        delete cleanedData.password_hash;
      }
      Object.keys(cleanedData).forEach((key) => {
        cleanedData[key] = this.excludePasswordFromResponse(cleanedData[key]);
      });

      return cleanedData;
    }

    return data;
  }
}
