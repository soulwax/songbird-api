import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();
    const startedAt = Date.now();

    const commonPayload = {
      method: request.method,
      path: request.originalUrl ?? request.url,
      requestId: this.getRequestId(request),
      ip: request.ip,
      userAgent: request.get('user-agent') ?? undefined,
      headers: request.headers,
      query: request.query,
      requestBody: request.body,
    };

    return next.handle().pipe(
      tap({
        next: (data) => {
          const durationMs = Date.now() - startedAt;
          void this.loggingService.logSuccess({
            ...commonPayload,
            statusCode: response.statusCode,
            durationMs,
            responseBody: data,
          });
        },
        error: (error) => {
          const durationMs = Date.now() - startedAt;
          void this.loggingService.logError({
            ...commonPayload,
            statusCode: this.extractStatusCode(error),
            durationMs,
            error: this.formatError(error),
          });
        },
      }),
    );
  }

  private getRequestId(request: Request): string | undefined {
    const headers = request.headers;
    return (
      (headers['x-request-id'] as string) ??
      (headers['x-correlation-id'] as string) ??
      undefined
    );
  }

  private extractStatusCode(error: unknown): number | undefined {
    if (typeof error === 'object' && error) {
      const maybeStatus = (error as Record<string, unknown>).status;
      if (typeof maybeStatus === 'number') {
        return maybeStatus;
      }

      const maybeStatusCode = (error as Record<string, unknown>).statusCode;
      if (typeof maybeStatusCode === 'number') {
        return maybeStatusCode;
      }
    }

    return undefined;
  }

  private formatError(error: unknown): unknown {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    return error;
  }
}

