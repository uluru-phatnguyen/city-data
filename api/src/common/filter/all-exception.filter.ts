/* eslint-disable */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { createResponse } from '../dto';
import {
  // EntityNotFoundError,
  QueryFailedError,
  TypeORMError,
} from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';
    let errorCode = 'UNKNOWN_ERROR';

    if (exception instanceof TypeORMError) {
      if (exception instanceof QueryFailedError) {
        errorCode = exception.driverError?.code;
        message = exception.driverError?.detail ?? exception.message;

        // https://www.postgresql.org/docs/current/errcodes-appendix.html
        switch (exception.driverError?.code) {
          //Class 08 — Connection Exception
          case '08000':
            errorCode = 'DB_CONNECTION_EXCEPTION';
            break;

          case '08003':
            errorCode = 'DB_CONNECTION_NOT_EXIST';
            break;

          case '08006':
            errorCode = 'DB_CONNECTION_FAILURE';
            break;

          case '08P01':
            errorCode = 'DB_PROTOCOL_VIOLATION';
            break;

          // Class 20 — Case Not Found
          case '20000':
            status = HttpStatus.NOT_FOUND;
            errorCode = 'NOT_FOUND';
            break;

          // Class 23 — Integrity Constraint Violation
          case '23502':
            status = HttpStatus.BAD_REQUEST;
            errorCode = 'NOT_NULL_VIOLATION';
            break;

          case '23503':
            status = HttpStatus.BAD_REQUEST;
            errorCode = 'FOREIGN_KEY_CONFLICT';
            break;

          case '23505':
            status = HttpStatus.BAD_REQUEST;
            errorCode = 'UNIQUE_VIOLATION';
            break;

          default:
            errorCode = exception.driverError?.code;
            break;
        }
      } else {
        message = exception?.message || 'Database error';
        errorCode = 'DB_ERROR';
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      message =
        typeof exceptionResponse === 'object' && exceptionResponse['message']
          ? exceptionResponse['message']
          : exception.message;

      errorCode =
        typeof exceptionResponse === 'object' && exceptionResponse['errorCode']
          ? exceptionResponse['errorCode']
          : 'UNKNOWN_ERROR';
    }

    const formattedResponse = createResponse(
      true,
      message,
      status,
      null,
      errorCode,
    );

    response.status(status).json(formattedResponse);
  }
}
