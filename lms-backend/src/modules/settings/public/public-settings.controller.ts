import { Controller, Get } from '@nestjs/common';
import { SettingsService } from '../settings.service';

@Controller('public')
export class PublicSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('get-landing-page-data')
  getLlandingPageData() {
    return this.settingsService.getLlandingPageData();
  }
}
