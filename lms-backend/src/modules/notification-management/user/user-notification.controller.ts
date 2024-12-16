import { Controller, Get, Param, Query } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from 'src/modules/users/entities/user.entity';

@Controller('user')
export class UserNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('my-notification-list')
  getMyNotificationList(@UserInfo() user: User, @Query() payload: any) {
    return this.notificationService.getMyNotificationList(user, payload);
  }

  @Get('notification-details-:id')
  getNotificationDetails(@UserInfo() user: User, @Param('id') id: number) {
    return this.notificationService.getNotificationDetails(user, id);
  }
}
