import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AdminLiveClassController } from './admin/admin-live-class.controller';
import { AgoraTokenService } from './class.service';
import { LiveClassInstructorController } from './instructor/liveclass.controller';
import { LiveClassService } from './live-class.service';
import { LiveClassStudentController } from './user/user-live-class.controller';

@Module({
  controllers: [
    AdminLiveClassController,
    LiveClassInstructorController,
    LiveClassStudentController,
  ],
  providers: [AgoraTokenService, LiveClassService],
  imports: [PrismaModule],
})
export class ClassModule {}
