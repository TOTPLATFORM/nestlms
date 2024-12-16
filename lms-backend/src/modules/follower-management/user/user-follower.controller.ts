import { Body, Controller, Post } from '@nestjs/common';
import { FollowerService } from '../follower.service';
import { MakeFollowerDto } from './dto/make-follower.dto';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from 'src/modules/users/entities/user.entity';

@Controller('user')
export class UserFollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post('make-follower')
  makeFollower(@UserInfo() user: User, @Body() payload: MakeFollowerDto) {
    return this.followerService.makeFollower(user, payload);
  }
}
