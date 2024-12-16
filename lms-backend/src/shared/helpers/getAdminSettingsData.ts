import { PrismaClient, processException } from './functions';

export async function getAdminSettingsData(slugs?: any) {
  try {
    let data = {};

    if (Array.isArray(slugs)) {
      await Promise.all(
        slugs.map(async (slug) => {
          const slufInfo: any = await PrismaClient.adminSettings.findFirst({
            where: {
              slug: slug,
            },
          });

          if (slufInfo) {
            data[slug] = slufInfo.value;
          } else {
            data[slug] = null;
          }
        }),
      );
    } else if (typeof slugs === 'string') {
      const slufInfo = await PrismaClient.adminSettings.findFirst({
        where: {
          slug: slugs,
        },
      });
      data[slugs] = slufInfo.value;
    } else {
      const slugInfoList = await PrismaClient.adminSettings.findMany();
      slugInfoList.map((item) => {
        data[item.slug] = item.value;
      });
    }
    return data;
  } catch (error) {
    processException(error);
  }
}
