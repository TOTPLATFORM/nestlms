import { Module } from '@nestjs/common';
import { AdminSubscriberController } from './admin/admin.controller';
import { UserSubscriberController } from './user/user.controller';
import { SubscriberService } from './subscriber.service';

@Module({
  controllers: [AdminSubscriberController, UserSubscriberController],
  providers: [SubscriberService],
})
export class SubscriberModule {}
