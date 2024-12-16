import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FollowerService } from '../follower.service';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';

@IsAdmin()
@Controller('admin')
export class AdminFollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Get('instructor-follower-list-:id')
  getInstructorFollowerList(
    @Param('id', ParseIntPipe) id: number,
    @Query() payload: any,
  ) {
    return this.followerService.getInstructorFollowerList(id, payload);
  }
}
