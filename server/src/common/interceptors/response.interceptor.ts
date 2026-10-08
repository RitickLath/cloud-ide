import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface Response<T> {
  statusCode: number;
  data: T;
  message: string;
  timestamp: string;
  success: boolean;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {

    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    const statusCode = res.statusCode;


    return next.handle().pipe(
      map(data => ({
        statusCode,
        data,
        message: 'Success',
        timestamp: new Date().toISOString(),
        success: true
      }))
    );
  }
}
