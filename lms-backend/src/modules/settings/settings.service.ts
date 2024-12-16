import { Injectable } from '@nestjs/common';
import {
  PrismaClient,
  addPhotoPrefix,
  adminSettingsValueBySlug,
  errorResponse,
  fetchMyUploadFilePathById,
  getAdminSettingsData,
  getInstructorSettingsData,
  instructorSettingsValueBySlug,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { updateSMTPSettingsDto } from './admin/dto/update-smtp-settings.dt';
import {
  AgoraCredentialsSlug,
  BusinessSettingsDataSlug,
  CountryListObjectArray,
  GeneralSettingsSlugs,
  GithubAuthCredentialsSlugs,
  GoogleAuthCredentialsSlugs,
  InstructorSettingsDataSlugs,
  LandingAboutUsSectionDataSlugs,
  LandingChooseUsSectionDataSlugs,
  LandingHowItWorkSectionDataSlugs,
  LandingMainBannerDataSlugs,
  LandingPageSlugs,
  SMTPSettingsSlugs,
  TermsPrivacySlugs,
} from 'src/shared/constants/array.constants';
import { ConfigService } from '@nestjs/config';
import { MailConfig } from 'src/shared/configs/config.interface';
import path from 'path';
import { MailerService } from 'src/shared/mail/mailer.service';
import { UpdateTermsPrivacyDto } from './admin/dto/update-terms-privacy.dt';
import { UpdateGeneralSettingsDto } from './admin/dto/update-general-settings.dto';
import { UpdateGoogleAuthSettingsDto } from './admin/dto/update-google-auth-settings.dto';
import { UpdateGithubAuthSettingsDto } from './admin/dto/update-github-auth-settings.dto';
import { UpdateLandingPageDataDto } from './admin/dto/update-landing-page-data.dto';
import { UpdateLandingAboutSectionDataDto } from './admin/dto/update-landing-about-section-data.dto';
import { UpdateLandingChooseUsSectionDataDto } from './admin/dto/update-landing-choose-us-section-data.dto';
import { UpdateLandingHowItWorkSectionDataDto } from './admin/dto/update-landing-how-it-work-data.dto';
import { ReviewService } from '../review/review.service';
import { User } from '@prisma/client';
import { use } from 'passport';
import { UpdateBusinessSettingsDto } from './admin/dto/update-business-settings.dto';
import { UpdateAgoraCredentialsDto } from './admin/dto/update-agora-credentials.dto';
import { statusOnOffConstant } from 'src/shared/helpers/coreConstant';

@Injectable()
export class SettingsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailSer: MailerService,
    private readonly reviewService: ReviewService,
  ) {}

  async updateOrCreate(slugKey: any, values: any) {
    try {
      const payload = {
        value: String(values),
      };

      await PrismaClient.adminSettings.upsert({
        where: { slug: slugKey },
        create: {
          // Data to insert if no matching record is found
          slug: slugKey, // Assuming slug is a required field
          value: payload.value, // Assuming payload contains the 'value' field
        },
        update: {
          // Data to update if a matching record is found
          value: payload.value, // Assuming payload contains the 'value' field
        },
      });
    } catch (error) {
      processException(error);
    }
  }

  async updateOrCreateInstructorSettings(
    userId: number,
    slugKey: any,
    values: any,
  ) {
    try {
      const payload = {
        value: String(values),
      };

      await PrismaClient.instructorSettings.upsert({
        where: { slug: slugKey },
        create: {
          userId: userId,
          slug: slugKey,
          value: payload.value,
        },
        update: {
          userId: userId,
          value: payload.value,
        },
      });
    } catch (error) {
      processException(error);
    }
  }

  async updateSMTPSettings(payload: updateSMTPSettingsDto) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const slugs: any = SMTPSettingsSlugs;
      const data = await getAdminSettingsData(slugs);

      return successResponse('SMTP settings is updated!', data);
    } catch (error) {
      processException(error);
    }
  }

  async getSmtpSettingsData() {
    try {
      const data = await getAdminSettingsData(SMTPSettingsSlugs);

      return successResponse('SMTP settings data!', data);
    } catch (error) {
      processException(error);
    }
  }

  async sendTestMail(payload: { email: string }) {
    try {
      const response = await this.mailSer.sendMail(
        payload.email,
        'test',
        'test-mail.hbs',
      );
      return response;
    } catch (error) {
      processException(error);
    }
  }

  async getCommonSettingsDataForUser() {
    try {
      const data = {};

      data['countryList'] = CountryListObjectArray;

      return successResponse('Common settings', data);
    } catch (error) {
      processException(error);
    }
  }

  async getCommonSettingsData() {
    try {
      const data = {};

      data['countryList'] = CountryListObjectArray;

      return successResponse('Common settings', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateTermsPrivacy(payload: UpdateTermsPrivacyDto) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(TermsPrivacySlugs);

      return successResponse(
        'Privacy policy and Terms condition is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getTermsPrivacyData() {
    try {
      const data = await getAdminSettingsData(TermsPrivacySlugs);

      return successResponse('Privacy policy and Terms condition data!', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateGeneralSettings(payload: UpdateGeneralSettingsDto) {
    try {
      const site_logo_path = payload.site_logo
        ? await fetchMyUploadFilePathById(payload.site_logo)
        : await adminSettingsValueBySlug('site_logo');
      const site_fav_icon_path = payload.site_fav_icon
        ? await fetchMyUploadFilePathById(payload.site_fav_icon)
        : await adminSettingsValueBySlug('site_fav_icon');

      const site_footer_logo_path = payload.site_footer_logo
        ? await fetchMyUploadFilePathById(payload.site_footer_logo)
        : await adminSettingsValueBySlug('site_footer_logo');

      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        if (key === 'site_logo') {
          value = site_logo_path;
        } else if (key === 'site_fav_icon') {
          value = site_fav_icon_path;
        } else if (key === 'site_footer_logo') {
          value = site_footer_logo_path;
        }
        return { key, value };
      });

      await Promise.all(
        keyValuePairs.map((element) =>
          this.updateOrCreate(element.key, element.value),
        ),
      );

      const settings = await getAdminSettingsData(GeneralSettingsSlugs);
      return successResponse('Setting updated successfully', settings);
    } catch (error) {
      processException(error);
    }
  }

  async getGeneralSettingsData() {
    try {
      const data: any = await getAdminSettingsData(GeneralSettingsSlugs);

      if (data.site_logo) data.site_logo = addPhotoPrefix(data.site_logo);
      if (data.site_fav_icon)
        data.site_fav_icon = addPhotoPrefix(data.site_fav_icon);
      data.site_footer_logo = addPhotoPrefix(data.site_footer_logo);
      return successResponse('General settings  data', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateGoogleAuthSettings(payload: UpdateGoogleAuthSettingsDto) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(GoogleAuthCredentialsSlugs);

      return successResponse(
        'Google auth credentials is update successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getGoogleAuthSettingsData() {
    try {
      const data = await getAdminSettingsData(GoogleAuthCredentialsSlugs);

      return successResponse('Google auth credentials', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateGithubAuthSettings(payload: UpdateGithubAuthSettingsDto) {
    try {
      const keyValuePairs = Object.keys(payload).map((key) => ({
        key,
        value: payload[key],
      }));

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(GithubAuthCredentialsSlugs);

      return successResponse(
        'Github auth credentials is update successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getGithubAuthSettingsData() {
    try {
      const data = await getAdminSettingsData(GithubAuthCredentialsSlugs);

      return successResponse('Github auth credentials', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateLandingMainBannerData(payload: UpdateLandingPageDataDto) {
    try {
      const landing_main_banner_image_url =
        payload.landing_main_banner_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_main_banner_image_url,
            )
          : await adminSettingsValueBySlug('landing_main_banner_image_url');

      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        if (key === 'landing_main_banner_image_url') {
          value = landing_main_banner_image_url;
        }
        return { key, value };
      });

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(LandingMainBannerDataSlugs);

      return successResponse(
        'Landing page main banner section data is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }
  async getLandingMainBannerData() {
    try {
      const data: any = await getAdminSettingsData(LandingMainBannerDataSlugs);
      data.landing_main_banner_image_url = addPhotoPrefix(
        data.landing_main_banner_image_url,
      );

      return successResponse('Landing page main banner section data', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateLandingAboutSectionData(
    payload: UpdateLandingAboutSectionDataDto,
  ) {
    try {
      const landing_about_us_first_image_url =
        payload.landing_about_us_first_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_about_us_first_image_url,
            )
          : await adminSettingsValueBySlug('landing_about_us_first_image_url');

      const landing_about_us_second_image_url =
        payload.landing_about_us_second_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_about_us_second_image_url,
            )
          : await adminSettingsValueBySlug('landing_about_us_second_image_url');

      const landing_about_us_third_image_url =
        payload.landing_about_us_third_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_about_us_third_image_url,
            )
          : await adminSettingsValueBySlug('landing_about_us_third_image_url');

      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        if (key === 'landing_about_us_first_image_url') {
          value = landing_about_us_first_image_url;
        }

        if (key === 'landing_about_us_second_image_url') {
          value = landing_about_us_second_image_url;
        }

        if (key === 'landing_about_us_third_image_url') {
          value = landing_about_us_third_image_url;
        }
        return { key, value };
      });

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(LandingAboutUsSectionDataSlugs);

      return successResponse(
        'Landing page about us section data is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getLandingAboutSectionData() {
    try {
      const data: any = await getAdminSettingsData(
        LandingAboutUsSectionDataSlugs,
      );

      data.landing_about_us_first_image_url = addPhotoPrefix(
        data.landing_about_us_first_image_url,
      );

      data.landing_about_us_second_image_url = addPhotoPrefix(
        data.landing_about_us_second_image_url,
      );

      data.landing_about_us_third_image_url = addPhotoPrefix(
        data.landing_about_us_third_image_url,
      );

      return successResponse('Landing page about us section data', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateLandingChooseUsSectionData(
    payload: UpdateLandingChooseUsSectionDataDto,
  ) {
    try {
      const landing_choose_us_first_image_url =
        payload.landing_choose_us_first_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_choose_us_first_image_url,
            )
          : await adminSettingsValueBySlug('landing_choose_us_first_image_url');

      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        if (key === 'landing_choose_us_first_image_url') {
          value = landing_choose_us_first_image_url;
        }

        return { key, value };
      });

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(LandingChooseUsSectionDataSlugs);

      return successResponse(
        'Landing page about us section data is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getLandingChooseUsSectionData() {
    try {
      const data: any = await getAdminSettingsData(
        LandingChooseUsSectionDataSlugs,
      );

      data.landing_choose_us_first_image_url = addPhotoPrefix(
        data.landing_choose_us_first_image_url,
      );

      return successResponse('Landing page choose us section data', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateLandingHowItWorkSectionData(
    payload: UpdateLandingHowItWorkSectionDataDto,
  ) {
    try {
      const landing_how_it_work_list_first_image_url =
        payload.landing_how_it_work_list_first_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_how_it_work_list_first_image_url,
            )
          : await adminSettingsValueBySlug(
              'landing_how_it_work_list_first_image_url',
            );

      const landing_how_it_work_list_second_image_url =
        payload.landing_how_it_work_list_second_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_how_it_work_list_second_image_url,
            )
          : await adminSettingsValueBySlug(
              'landing_how_it_work_list_second_image_url',
            );

      const landing_how_it_work_list_third_image_url =
        payload.landing_how_it_work_list_third_image_url
          ? await fetchMyUploadFilePathById(
              payload.landing_how_it_work_list_third_image_url,
            )
          : await adminSettingsValueBySlug(
              'landing_how_it_work_list_third_image_url',
            );

      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        if (key === 'landing_how_it_work_list_first_image_url') {
          value = landing_how_it_work_list_first_image_url;
        }

        if (key === 'landing_how_it_work_list_second_image_url') {
          value = landing_how_it_work_list_second_image_url;
        }

        if (key === 'landing_how_it_work_list_third_image_url') {
          value = landing_how_it_work_list_third_image_url;
        }

        return { key, value };
      });

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(LandingHowItWorkSectionDataSlugs);

      return successResponse(
        'Landing page how it work section data is updated successfully!',
        data,
      );
    } catch (error) {
      processException(error);
    }
  }

  async getLandingHowItWorkSectionData() {
    try {
      const data: any = await getAdminSettingsData(
        LandingHowItWorkSectionDataSlugs,
      );

      data.landing_how_it_work_list_first_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_first_image_url,
      );

      data.landing_how_it_work_list_second_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_second_image_url,
      );

      data.landing_how_it_work_list_third_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_third_image_url,
      );

      return successResponse('Landing page choose us section data', data);
    } catch (error) {
      processException(error);
    }
  }

  async getLlandingPageData() {
    try {
      const data: any = await getAdminSettingsData(LandingPageSlugs);
      data.landing_main_banner_image_url = addPhotoPrefix(
        data.landing_main_banner_image_url,
      );

      data.landing_about_us_first_image_url = addPhotoPrefix(
        data.landing_about_us_first_image_url,
      );

      data.landing_about_us_second_image_url = addPhotoPrefix(
        data.landing_about_us_second_image_url,
      );

      data.landing_about_us_third_image_url = addPhotoPrefix(
        data.landing_about_us_third_image_url,
      );

      data.landing_choose_us_first_image_url = addPhotoPrefix(
        data.landing_choose_us_first_image_url,
      );

      data.landing_how_it_work_list_first_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_first_image_url,
      );

      data.landing_how_it_work_list_second_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_second_image_url,
      );

      data.landing_how_it_work_list_third_image_url = addPhotoPrefix(
        data.landing_how_it_work_list_third_image_url,
      );

      const reviewResponse =
        await this.reviewService.getReviewListForLandingPage(8);

      const landingData = {
        landing_data: data,
        review_list: reviewResponse.data,
      };

      return successResponse('Landing page data!', landingData);
    } catch (error) {
      processException(error);
    }
  }

  async updateInstructorSettings(user: User, payload: any) {
    try {
      const instructor_signature = payload.instructor_signature
        ? await fetchMyUploadFilePathById(payload.instructor_signature)
        : await instructorSettingsValueBySlug(user.id, 'instructor_signature');

      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        if (key === 'instructor_signature') {
          value = instructor_signature;
        }
        return { userId: user.id, key, value };
      });

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreateInstructorSettings(
            element.userId,
            element.key,
            element.value,
          );
        }),
      );

      const data: any = await getInstructorSettingsData(
        user.id,
        InstructorSettingsDataSlugs,
      );

      data.instructor_signature = addPhotoPrefix(data.instructor_signature);

      return successResponse('Settings is updated!', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateBusinessSettings(payload: UpdateBusinessSettingsDto) {
    try {
      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        return { key, value };
      });

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(BusinessSettingsDataSlug);

      return successResponse('Business Settings is updated!', data);
    } catch (error) {
      processException(error);
    }
  }

  async getBusinessSettingsData() {
    try {
      const data = await getAdminSettingsData(BusinessSettingsDataSlug);

      return successResponse('Business Settings is data!', data);
    } catch (error) {
      processException(error);
    }
  }

  async updateAgoraCredentials(payload: UpdateAgoraCredentialsDto) {
    try {
      if (payload.agora_status === statusOnOffConstant.ACTIVE) {
        if (!payload.agora_app_id || !payload.app_certificate) {
          return errorResponse(
            'Agora App ID and Agora App Certificate is required!',
          );
        }
      }
      const keyValuePairs = Object.entries(payload).map(([key, value]) => {
        return { key, value };
      });

      await Promise.all(
        keyValuePairs.map(async (element) => {
          await this.updateOrCreate(element.key, element.value);
        }),
      );

      const data = await getAdminSettingsData(AgoraCredentialsSlug);

      return successResponse('Agora Credentials Settings is updated!', data);
    } catch (error) {
      processException(error);
    }
  }

  async getAgoraSettingsData() {
    try {
      const data = await getAdminSettingsData(AgoraCredentialsSlug);

      return successResponse('Agora Settings data!', data);
    } catch (error) {
      processException(error);
    }
  }
}
