import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  StoreLiveClassDto,
  UpdateLiveClassDto,
} from './dto/store-live-class.dto';
import { AgoraTokenService } from '../class.service';
import { LiveClassService } from '../live-class.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';
import { CreateLiveClassDto } from './dto/create-liveclass.dto';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';

@IsInstructor()
@Controller('instructor')
export class LiveClassInstructorController {
  constructor(private readonly liveClassService: LiveClassService) {}
  @Post('create-live-class')
  createLiveClass(@UserInfo() user: User, @Body() payload: StoreLiveClassDto) {
    return this.liveClassService.createLiveClass(user, payload);
  }
  @Patch('update-live-class')
  updateLiveClass(@UserInfo() user: User, @Body() data: UpdateLiveClassDto) {
    return this.liveClassService.updateLiveClass(user, data);
  }
  @Get('get-live-class/:class_id')
  getLiveClassById(@Param('class_id') class_id: string) {
    return this.liveClassService.getLiveClassDetails(class_id);
  }
  @Get('get-course-for-live-classes')
  getCourseForLiveClasses(@UserInfo() user: User) {
    return this.liveClassService.liveClassCourseList(user);
  }
  @Get('get-live-class')
  getLiveClass(@UserInfo() user: User, @Query() payload: any) {
    return this.liveClassService.getInstructorLiveClasses(user, payload);
  }
  @Delete('delete-live-class/:id')
  deleteLiveClass(@UserInfo() user: User, @Param() payload: { id: string }) {
    return this.liveClassService.deleteLiveClass(user, payload.id);
  }

  @Post('start-live-class')
  startLiveClass(@UserInfo() user: User, @Body() payload: CreateLiveClassDto) {
    return this.liveClassService.InstructorStartLiveClass(
      user,
      payload.class_id,
      payload.class_name,
    );
  }
  @Post('leave-live-class')
  leaveLiveClass(
    @UserInfo() user: User,
    @Body() payload: { className: string },
  ) {
    return this.liveClassService.StudentLeaveLiveClass(user, payload.className);
  }
}
