import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from '../notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';

@IsAdmin()
@Controller('admin')
export class AdminNotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send-notification')
  sendNotification(@Body() payload: SendNotificationDto) {
    return this.notificationService.sendNotification(payload);
  }
}
