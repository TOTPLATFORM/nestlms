import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from '../settings.service';
import { updateSMTPSettingsDto } from './dto/update-smtp-settings.dt';
import { ResponseModel } from 'src/shared/models/response.model';
import { IsAdmin } from 'src/shared/decorators/is-admin.decorator';
import { UpdateTermsPrivacyDto } from './dto/update-terms-privacy.dt';
import { UpdateGeneralSettingsDto } from './dto/update-general-settings.dto';
import { UpdateGoogleAuthSettingsDto } from './dto/update-google-auth-settings.dto';
import { UpdateGithubAuthSettingsDto } from './dto/update-github-auth-settings.dto';
import { UpdateLandingPageDataDto } from './dto/update-landing-page-data.dto';
import { UpdateLandingAboutSectionDataDto } from './dto/update-landing-about-section-data.dto';
import { UpdateLandingChooseUsSectionDataDto } from './dto/update-landing-choose-us-section-data.dto';
import { UpdateLandingHowItWorkSectionDataDto } from './dto/update-landing-how-it-work-data.dto';
import { UpdateBusinessSettingsDto } from './dto/update-business-settings.dto';
import { UpdateAgoraCredentialsDto } from './dto/update-agora-credentials.dto';

@IsAdmin()
@Controller('admin')
export class AdminSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('update-smtp-settings')
  updateSMTPSettings(
    @Body() payload: updateSMTPSettingsDto,
  ): Promise<ResponseModel> {
    return this.settingsService.updateSMTPSettings(payload);
  }

  @Get('get-smtp-settings-data')
  getSmtpSettingsData(): Promise<ResponseModel> {
    return this.settingsService.getSmtpSettingsData();
  }

  @Post('send-test-mail')
  sendTestMail(@Body() payload: { email: string }) {
    return this.settingsService.sendTestMail(payload);
  }

  @Post('update-terms-privacy')
  updateTermsPrivacy(
    @Body() payload: UpdateTermsPrivacyDto,
  ): Promise<ResponseModel> {
    return this.settingsService.updateTermsPrivacy(payload);
  }

  @Get('get-terms-privacy-data')
  getTermsPrivacyData(): Promise<ResponseModel> {
    return this.settingsService.getTermsPrivacyData();
  }

  @Post('update-general-settings')
  updateGeneralSettings(
    @Body() payload: UpdateGeneralSettingsDto,
  ): Promise<ResponseModel> {
    return this.settingsService.updateGeneralSettings(payload);
  }

  @Get('general-settings-data')
  getGeneralSettingsData(): Promise<ResponseModel> {
    return this.settingsService.getGeneralSettingsData();
  }

  @Post('update-google-auth-settings')
  updateGoogleAuthSettings(@Body() payload: UpdateGoogleAuthSettingsDto) {
    return this.settingsService.updateGoogleAuthSettings(payload);
  }

  @Get('get-google-auth-settings-data')
  getGoogleAuthSettingsData() {
    return this.settingsService.getGoogleAuthSettingsData();
  }

  @Post('update-github-auth-settings')
  updateGithubAuthSettings(@Body() payload: UpdateGithubAuthSettingsDto) {
    return this.settingsService.updateGithubAuthSettings(payload);
  }

  @Get('get-github-auth-settings-data')
  getGithubAuthSettingsData() {
    return this.settingsService.getGithubAuthSettingsData();
  }

  @Post('update-landing-main-banner-data')
  updateLandingMainBannerData(@Body() payload: UpdateLandingPageDataDto) {
    return this.settingsService.updateLandingMainBannerData(payload);
  }

  @Get('get-landing-main-banner-data')
  getLandingMainBannerData() {
    return this.settingsService.getLandingMainBannerData();
  }

  @Post('update-landing-about-section-data')
  updateLandingAboutSectionData(
    @Body() payload: UpdateLandingAboutSectionDataDto,
  ) {
    return this.settingsService.updateLandingAboutSectionData(payload);
  }

  @Get('get-landing-about-section-data')
  getLandingAboutSectionData() {
    return this.settingsService.getLandingAboutSectionData();
  }

  @Post('update-landing-choose-us-section-data')
  updateLandingChooseUsSectionData(
    @Body() payload: UpdateLandingChooseUsSectionDataDto,
  ) {
    return this.settingsService.updateLandingChooseUsSectionData(payload);
  }

  @Get('get-landing-choose-us-section-data')
  getLandingChooseUsSectionData() {
    return this.settingsService.getLandingChooseUsSectionData();
  }

  @Post('update-landing-how-it-work-data')
  updateLandingHowItWorkSectionData(
    @Body() payload: UpdateLandingHowItWorkSectionDataDto,
  ) {
    return this.settingsService.updateLandingHowItWorkSectionData(payload);
  }

  @Get('get-landing-how-it-work-data')
  getLandingHowItWorkSectionData() {
    return this.settingsService.getLandingHowItWorkSectionData();
  }

  @Post('update-business-settings')
  updateBusinessSettings(@Body() payload: UpdateBusinessSettingsDto) {
    return this.settingsService.updateBusinessSettings(payload);
  }

  @Get('get-business-settings-data')
  getBusinessSettingsData() {
    return this.settingsService.getBusinessSettingsData();
  }

  @Post('update-agora-settings')
  updateAgoraCredentials(@Body() payload:UpdateAgoraCredentialsDto){
    return this.settingsService.updateAgoraCredentials(payload);
  }

  @Get('get-agora-settings-data')
  getAgoraSettingsData() {
    return this.settingsService.getAgoraSettingsData();
  }
  
}
