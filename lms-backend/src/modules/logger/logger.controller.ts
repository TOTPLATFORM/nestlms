import { Controller, Delete, Get, Query } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import { LogService } from './log.service';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';

@Public()
@Controller('logger')
export class LoggerController {
  constructor(private readonly logService: LogService) {}

  @Get('get-log-file-names')
  getLogFilesName() {
    return this.logService.getLogFilesName();
  }

  @Get('details')
  getDetailsOfLogg(@Query() payload: any) {
    return this.logService.getLogFromAllFiles(payload);
  }

  @Delete('delete')
  deleteLoggFiles(@Query() payload: any) {
    return this.logService.deleteLoggFiles(payload);
  }
}
