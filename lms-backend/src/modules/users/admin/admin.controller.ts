import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';
import { AdminService } from './admin.service';
import { CreateNewUserDto } from './dto/create-new-user.dto';
import { CreateNewAdminDto } from './dto/create-new-admin.dto';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from '@prisma/client';

@IsAdmin()
// @IsInstructor()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly userService: UsersService,
    private readonly adminService: AdminService,
  ) {}

  @Post('create-new-user')
  createNewUser(@Body() payload: CreateNewUserDto) {
    return this.adminService.createNewUser(payload);
  }

  @Post('create-new-admin')
  createNewAdmin(@Body() payload: CreateNewAdminDto) {
    return this.adminService.createNewAdmin(payload);
  }

  @Get('get-student-list')
  getStudentList(@Query() payload: any) {
    return this.adminService.getStudentList(payload);
  }
  @Get('admin-dashboard')
  getAdminDashboardDetails() {
    return this.adminService.getAdminDashboardInfo();
  }

  @Get('get-instructor-list')
  getInstructorList(@Query() payload: any) {
    return this.adminService.getInstructorList(payload);
  }
  @Get('get-instructor-list-no-pagination')
  getInstructorListNoPagination() {
    return this.adminService.getInstructorListNoPagination();
  }

  @Get('get-admin-list')
  getAdminList(@Query() payload: any) {
    return this.adminService.getAdminList(payload);
  }

  @Post('status-change-user')
  statusChangeUser(@Body() payload: { user_id: number; status_type: number }) {
    return this.userService.statusChangeUser(payload);
  }
}
