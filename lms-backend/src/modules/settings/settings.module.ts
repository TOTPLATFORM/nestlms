import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AdminSettingsController } from './admin/admin-settings.controller';
import { MailerService } from 'src/shared/mail/mailer.service';
import { UserSettingsController } from './user/user-settings.controller';
import { PublicSettingsController } from './public/public-settings.controller';
import { ReviewService } from '../review/review.service';

@Module({
  controllers: [
    AdminSettingsController,
    UserSettingsController,
    PublicSettingsController,
  ],
  providers: [SettingsService, MailerService, ReviewService],
  exports: [MailerService, ReviewService],
})
export class SettingsModule {}
