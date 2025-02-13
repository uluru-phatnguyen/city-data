import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, createResponse } from './../dto';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        const response = context
          .switchToHttp()
          .getResponse<{ statusCode: number }>();
        const statusCode = response.statusCode;
        return createResponse(false, 'Success', statusCode, data);
      }),
    );
  }
}
