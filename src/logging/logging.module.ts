import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingService } from './logging.service';

@Module({
  imports: [PrismaModule],
  providers: [LoggingService, LoggingInterceptor],
  exports: [LoggingService, LoggingInterceptor],
})
export class LoggingModule {}

