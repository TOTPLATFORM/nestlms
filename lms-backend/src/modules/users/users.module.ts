import { Module } from '@nestjs/common';
import { UsersService } from './user/users.service';
import { UserController } from './user/users.controller';
import { UserVerificationCodeService } from '../verification_code/user-verify-code.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { MailerService } from 'src/shared/mail/mailer.service';

@Module({
  controllers: [UserController, AdminController],
  providers: [UsersService, UserVerificationCodeService,AdminService, MailerService],
  imports: [PrismaModule],
  exports: [UsersService,AdminService],
})
export class UsersModule {}
