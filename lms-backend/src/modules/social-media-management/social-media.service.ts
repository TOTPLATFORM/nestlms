import { Injectable } from "@nestjs/common";
import { StoreSocialMediaDto } from "./admin/dto/store-social-media.dto";
import { PrismaClient, addPhotoPrefix, errorResponse, paginatioOptions, paginationMetaData, processException, successResponse } from "src/shared/helpers/functions";
import { DefaultPaginationMetaData } from "src/shared/helpers/coreConstant";

@Injectable()
export class SocialMediaService {
    async createNewSocialMedia(payload: StoreSocialMediaDto) {
        try {
          let image_url = null;
          if (payload.file_id) {
            const fileDetails = await PrismaClient.myUploads.findFirst({
              where: {
                id: payload.file_id,
              },
            });
    
            if (!fileDetails) {
              return errorResponse('Invalid image request!');
            }
    
            image_url = fileDetails.file_path;
          }
          const newSocialMedia = await PrismaClient.socialMedia.create({
            data: {
              name: payload.name,
              status: payload.status,
              link: payload.link,
              image_url: image_url,
            },
          });
          return successResponse(
            'New Social Media is addedd successfully!',
            newSocialMedia,
          );
        } catch (error) {
          processException(error);
        }
      }

    async getSocialMediaListForAdmin(payload: any) {
    try {
        const data = {};
        const whereClause = payload.search
        ? {
            name: {
                contains: payload.search,
            },
            }
        : {};
        if (payload.limit || payload.offset) {
        const paginate = await paginatioOptions(payload);

        const socialMediaList = await PrismaClient.socialMedia.findMany({
            where: whereClause,
            ...paginate,
        });

        const paginationMeta =
            socialMediaList.length > 0
            ? await paginationMetaData('socialMedia', payload, whereClause)
            : DefaultPaginationMetaData;

        data['list'] = socialMediaList;
        data['meta'] = paginationMeta;
        } else {
        const socialMediaList = await PrismaClient.socialMedia.findMany({
            where: whereClause,
        });

        data['list'] = socialMediaList;
        }
        data['list'].map(function (query) {
        return (query.image_url = addPhotoPrefix(query.image_url));
        });
        return successResponse('Social Media List data', data);
    } catch (error) {
        processException(error);
    }
    }

    async getSocialMediaDetails(id: number) {
        try {
            const socialMediaDetails = await PrismaClient.socialMedia.findFirst({
            where: {
                id: id,
            },
            });
            if (!socialMediaDetails) {
            return errorResponse('Invalid request');
            }

            socialMediaDetails.image_url = addPhotoPrefix(
            socialMediaDetails.image_url,
            );
            return successResponse('Social Media details', socialMediaDetails);
        } catch (error) {
            processException(error);
        }
    }

    async updateSocialMedia(social_media_id:number,payload: StoreSocialMediaDto) {
        try {
          let image_url = null;
          if (payload.file_id) {
            const fileDetails = await PrismaClient.myUploads.findFirst({
              where: {
                id: payload.file_id,
              },
            });
    
            if (!fileDetails) {
              return errorResponse('Invalid image request!');
            }
    
            image_url = fileDetails.file_path;
          }
    
          const socialMediaDetails = await PrismaClient.socialMedia.findFirst({
            where: {
              id: social_media_id,
            },
          });
    
          if (!socialMediaDetails) {
            return errorResponse('Invalid request!');
          }
    
          const updateSocialMedia = await PrismaClient.socialMedia.update({
            where: {
              id: socialMediaDetails.id,
            },
            data: {
              name: payload.name,
              status: payload.status,
              image_url: image_url ? image_url : socialMediaDetails.image_url,
              link: payload.link,
            },
          });
    
          return successResponse(
            'Social Media is updated successfully!',
            updateSocialMedia,
          );
        } catch (error) {
          processException(error);
        }
      }

      async deleteSocialMedia(id: number) {
        try {
          const details = await PrismaClient.socialMedia.findFirst({
            where: {
              id: id,
            },
          });
          if (!details) {
            return errorResponse('Invalid request!');
          }
    
          await PrismaClient.socialMedia.delete({
            where: {
              id: details.id,
            },
          });
    
          return successResponse('Social media is deleted successfully!');
        } catch (error) {
          processException(error);
        }
      }
}