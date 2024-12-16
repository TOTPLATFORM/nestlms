import { Module } from '@nestjs/common';
import { UserNotificationController } from './user/user-notification.controller';
import { AdminNotificationController } from './admin/admin-notification.controller';
import { NotificationService } from './notification.service';

@Module({
  controllers: [UserNotificationController, AdminNotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
