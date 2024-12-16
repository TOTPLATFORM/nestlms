import { Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { AdminController } from './admin/admin.controller';
import { UserController } from './user/user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [AdminController, UserController],
  providers: [KycService],
  imports: [PrismaModule],
})
export class KycModule {}
