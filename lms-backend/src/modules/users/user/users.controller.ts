import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './dto/user-response';
import { UsersService } from './users.service';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { errorResponse, successResponse } from 'src/shared/helpers/functions';
import { User } from '@prisma/client';
import { coreConstant } from 'src/shared/helpers/coreConstant';
import { ResponseModel } from 'src/shared/models/response.model';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { query } from 'express';
import { userInfo } from 'os';
import { use } from 'passport';
import { User as UserEntity } from '../entities/user.entity';
import { ChangePasswordDto } from '../../auth/dto/change-password.dto';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}
  @Get('profile')
  async getProfile(@Request() req, @UserInfo() user: UserEntity) {
    return this.userService.getProfile(user);
  }
  @IsInstructor()
  @Get('instructor-dashboard-info')
  getInstructirDashboardInfo(@UserInfo() user: User) {
    return this.userService.getInstructirDashboardInfo(user);
  }
  @IsAdmin()
  @Post('create-user')
  create(@Body() payload: CreateUserDto): Promise<UserResponse> {
    return this.userService.create(payload);
  }

  @IsAdmin()
  @Get('user-list')
  list(@Query() payload: any): Promise<ResponseModel> {
    return this.userService.userList(payload);
  }

  @Post('update-profile')
  updateProfile(
    @UserInfo() user: User,
    @Body() payload: UpdateUserDto,
  ): Promise<ResponseModel> {
    return this.userService.updateProfile(user, payload);
  }

  @Post('check-user-name')
  checkUserNameIsUnique(
    @UserInfo() user: User,
    @Body()
    payload: {
      user_name: string;
    },
  ): Promise<ResponseModel> {
    return this.userService.checkUserNameIsUnique(user, payload);
  }
  @Post('become-an-instructor')
  becomeAnInstructor(@UserInfo() user: User): Promise<ResponseModel> {
    return this.userService.becomeAnInstructor(user);
  }
  @IsAdmin()
  @Post('assign-an-instructor')
  assignInstructor(
    @Body() payload: { user_id: number },
  ): Promise<ResponseModel> {
    return this.userService.assignInstructor(payload.user_id);
  }
  @IsAdmin()
  @Get('get-pending-instructor-applications')
  getPendingInstructorApplications(
    @Query() payload: any,
  ): Promise<ResponseModel> {
    return this.userService.getPendingInstructorApplications(payload);
  }

  @Get('get-instructor-application-status')
  getInstructorApplicationStatus(
    @UserInfo() user: User,
  ): Promise<ResponseModel> {
    return this.userService.getInstructorApplicationStatus(user);
  }

  @IsAdmin()
  @Post('change-status')
  changeStatus(@Body() payload: { user_id: number }): Promise<ResponseModel> {
    return this.userService.changeStatus(payload);
  }

  @Get('user-list-by-country')
  userListByCountryWise(): Promise<ResponseModel> {
    return this.userService.userListByCountryWise();
  }

  @IsAdmin()
  @Get('user-profile-details')
  userProfileDetails(
    @Query() payload: { user_id: number },
  ): Promise<ResponseModel> {
    return this.userService.userProfileDetails(payload);
  }

  @IsAdmin()
  @Post('update-email')
  updateEmail(
    @UserInfo() user: User,
    @Body()
    payload: {
      email: string;
    },
  ): Promise<ResponseModel> {
    return this.userService.updateEmail(user, payload);
  }

  @Post('test-text-gen')
  testTextGen(@Body() payload: { text: string }) {
    return this.userService.testTextGen(payload);
  }

  @Post('change-password')
  changePassword(@UserInfo() user: User, @Body() payload: ChangePasswordDto) {
    return this.userService.changePassword(user, payload);
  }
}
