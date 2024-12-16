import { Controller, Get, Query } from '@nestjs/common';
import { EnrollmentService } from '../enrollment.service';

@Controller('admin')
export class EnrollmentAdminController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get('course-transaction-report')
  getCourseTransactionReport(@Query() payload: any) {
    return this.enrollmentService.getCourseTransactionReport(payload);
  }
}
