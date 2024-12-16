import { Module } from '@nestjs/common';

import { MyLogger } from './logger.service';
import { LoggerController } from './logger.controller';
import { LogService } from './log.service';

@Module({
  controllers:[LoggerController],
  providers: [MyLogger, LogService],
  exports: [MyLogger],
})
export class LoggerModule {}
