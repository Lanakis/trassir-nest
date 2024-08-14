import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiExceptionModel } from './apiException.model';
import { mergeAndUniq } from '@nestjs/swagger/dist/utils/merge-and-uniq.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception?.response?.statusCode ?? 400;
    const exceptionApi = new ApiExceptionModel();
    console.trace(exception);
    mergeAndUniq(exceptionApi, {
      statusCode: status,
      message: exception?.response?.message ?? exception?.message,
      path: request.url,
      method: request.method,
      error: HttpStatus[status],
    });
    response?.status(status).json(exceptionApi);
  }
}
