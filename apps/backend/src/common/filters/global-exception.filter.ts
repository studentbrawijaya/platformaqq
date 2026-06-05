import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message = typeof body === 'object' ? (body as { message?: string | string[] }).message : exception.message;
      const details = Array.isArray(message) ? message : [];
      this.logger.warn(`${request.method} ${request.url} -> ${status}`);
      response.status(status).json({
        success: false,
        error: {
          code: status === HttpStatus.TOO_MANY_REQUESTS ? 'TOO_MANY_REQUESTS' : 'HTTP_ERROR',
          message: Array.isArray(message) ? 'Validation error' : message ?? 'Request failed',
          details,
        },
      });
      return;
    }

    this.logger.error(`${request.method} ${request.url} -> 500`, exception as Error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Terjadi kesalahan pada server',
        details: [],
      },
    });
  }
}
