import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PublicService } from './public.service';
import { ResponseModel } from 'src/shared/models/response.model';
import { Public } from 'src/shared/decorators/public.decorator';
@Public()
@Controller('public-api')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('language-list')
  getAllLanguageList() {
    return this.publicService.getAllLanguageList();
  }

  @Get('common-settings')
  commonSettings(): Promise<ResponseModel> {
    return this.publicService.commonSettings();
  }

  @Get('landing-page-data')
  getLandingPageData(): Promise<ResponseModel> {
    return this.publicService.getLandingPageData();
  }

  @Get('instructor-profile-details-:user_name')
  getInstructorProfileDetails(@Param('user_name') user_name: string) {
    return this.publicService.getInstructorProfileDetails(user_name);
  }
  @Get('get-instructors')
  getInstructors() {
    return this.publicService.getInstructors();
  }

  @Get('get-terms-condition-data')
  getTermsConditionData() {
    return this.publicService.getTermsConditionData();
  }

  @Get('get-privacy-policy-data')
  getPrivacyPolicyData() {
    return this.publicService.getPrivacyPolicyData();
  }
}
