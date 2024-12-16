import { Body, Controller, Post } from '@nestjs/common';

import { LiveClassService } from '../live-class.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';
import { CreateLiveClassDto } from '../instructor/dto/create-liveclass.dto';

@Controller('student')
export class LiveClassStudentController {
  constructor(private readonly liveClassService: LiveClassService) {}
  @Post('join-live-class')
  startLiveClass(@UserInfo() user: User, @Body() payload: CreateLiveClassDto) {
    return this.liveClassService.StudentJoinLiveClass(
      user,
      payload.class_id,
      payload.class_name,
    );
  }
}
