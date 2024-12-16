import { Module } from '@nestjs/common';
import { FollowerService } from './follower.service';
import { UserFollowerController } from './user/user-follower.controller';
import { AdminFollowerController } from './admin/admin-follower.controller';

@Module({
  controllers: [UserFollowerController, AdminFollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
