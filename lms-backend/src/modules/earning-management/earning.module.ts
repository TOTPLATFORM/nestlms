import { Module } from '@nestjs/common';
import { InstructorEarningController } from './instructor/instructor-earning.controller';
import { EarningService } from './earning.service';
import { AdminEarningController } from './admin/admin-earning.controller';

@Module({
  controllers: [InstructorEarningController, AdminEarningController],
  providers: [EarningService],
})
export class EarningModule {}
