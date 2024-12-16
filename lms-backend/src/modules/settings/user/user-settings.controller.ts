import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from '../settings.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserSettingsController {
  constructor(private readonly settingService: SettingsService) {}

  @IsInstructor()
  @Post('update-instructor-settings')
  updateInstructorSettings(@UserInfo() user: User, @Body() payload: any) {
    return this.settingService.updateInstructorSettings(user, payload);
  }
}
