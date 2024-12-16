import { PrismaService } from '../../../src/modules/prisma/prisma.service';
import { ResponseModel } from '../models/response.model';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Prisma, User } from '@prisma/client';
const crypto = require('crypto');
import * as bcrypt from 'bcrypt';
import sharp from 'sharp';
import * as fs from 'fs';

import { DISCOUNT_TYPE, UPLOAD_SOURCE, coreConstant } from './coreConstant';
import path from 'path';
import { async } from 'rxjs';
import { MyLogger } from '../../modules/logger/logger.service';
import { use } from 'passport';
import { RtcTokenBuilder } from 'agora-access-token';
// import { User } from 'src/modules/users/entities/user.entity';
export let app: NestExpressApplication;
export let PrismaClient: PrismaService;
export let myLogger;

export async function setApp(nestapp) {
  app = nestapp;

  PrismaClient = app.get(PrismaService);
  myLogger = await app.resolve(MyLogger);
}
export function createUniqueCode() {
  let date = new Date().getTime();
  const id = crypto.randomBytes(10).toString('hex');
  const data = id + date;
  return data;
}
export function addPhotoPrefix(inputString: string): string {
  let prefix: string = process.env.BACKEND_URL;
  if (inputString) {
    return `${prefix}${inputString}`;
  } else {
    return null;
  }
}
export function processCourseLinks(course: any): any {
  const processedCourse = {
    ...course,
    thumbnail_link: addPhotoPrefix(course.thumbnail_link),
    cover_image_link: addPhotoPrefix(course.cover_image_link),
    demo_video:
      course.video_upload_source === UPLOAD_SOURCE.LOCAL && course.demo_video
        ? addPhotoPrefix(course.demo_video)
        : course.demo_video,
  };

  if (course?.User) {
    processedCourse.User = {
      ...course.User,
      photo: addPhotoPrefix(course.User.photo),
    };
  } else {
    // If photo is not available, remove the User property
    delete processedCourse.User;
  }

  return processedCourse;
}

export async function hashedPassword(password: string) {
  const saltOrRounds = 10;
  const hashPassword = await bcrypt.hash(password, saltOrRounds);
  return hashPassword;
}
export function wordCountMultilingual(inputString) {
  // Split the input string into words using Unicode properties
  const words = inputString
    .trim()
    .split(/[\p{White_Space}\p{Punctuation}]+/u)
    .filter(Boolean);

  // Return the count of words
  return words.length;
}

export function processException(e) {
  storeException(e.message, 'error', e.stack);

  checkPrismaError(e);
  if (
    (e.hasOwnProperty('response') &&
      !e.response.hasOwnProperty('success') &&
      !e.response.hasOwnProperty('data')) ||
    !e.hasOwnProperty('response')
  ) {
    // myLogger.error(e);
  }
  // throw e;
}
function checkPrismaError(e) {
  if (
    e instanceof Prisma.PrismaClientKnownRequestError ||
    e instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    // throw new Error('Something went wrong.');
    return errorResponse('Something went wrong.');
  }
}
export function successResponse(msg?: string, data?: object): ResponseModel {
  return {
    success: true,
    message: msg ?? 'Response Success!',
    data: data || null,
  };
}
export function errorResponse(msg?: string, data?: object): ResponseModel {
  return {
    success: false,
    message: msg ?? 'Response Error!',
    data: data || null,
  };
}

export function generateMailKey() {
  return generateNDigitNumber(6);
}

function generateNDigitNumber(n) {
  return Math.floor(
    Math.pow(10, n - 1) + Math.random() * 9 * Math.pow(10, n - 1),
  );
}

export function addDayWithCurrentDate(dayCount: number) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + dayCount);
  return currentDate;
}

export function clearTrailingSlash(str: string) {
  return str.replace(/\/$/, '');
}

export function exchange_app_url() {
  return clearTrailingSlash(process.env.EXCHANGE_APP_URL ?? '');
}

export function base_url() {
  return clearTrailingSlash(process.env.APP_URL ?? '');
}

export function envAppName() {
  return process.env.APP_NAME || '';
}

export async function appName(): Promise<string> {
  return process.env.APP_NAME || '';
}

export async function emailAppName(): Promise<string> {
  const app_name = await appName();
  return app_name ? '[' + app_name + ']' : '';
}
export function isArrayofObjects(arr) {
  if (!Array.isArray(arr)) {
    return false;
  }

  for (const element of arr) {
    if (
      typeof element !== 'object' ||
      element === null ||
      Array.isArray(element)
    ) {
      return false;
    }
  }

  return true;
}
export function isValidArrayOfObjectsStringChecker(jsonString) {
  try {
    const parsedData = JSON.parse(jsonString);
    console.log(parsedData, 'parsedData');
    if (!Array.isArray(parsedData)) {
      return false;
    }

    for (const element of parsedData) {
      if (
        typeof element !== 'object' ||
        element === null ||
        Array.isArray(element)
      ) {
        return false;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function formatLimitOffset(payload: any) {
  let limit = payload.limit ? Math.abs(parseInt(payload.limit)) : 10;
  let offset = payload.offset ? Math.abs(parseInt(payload.offset)) : 1;

  limit = isNaN(limit) ? 10 : limit;
  limit = limit > 0 ? limit : 10;

  offset = isNaN(offset) ? 1 : offset;
  offset = offset > 0 ? offset : 1;

  return {
    limit,
    offset,
  };
}

export async function paginatioOptions(payload: any) {
  const limitOffset = await formatLimitOffset(payload);
  const limit = limitOffset.limit;
  const offset = limitOffset.offset;
  let skip = 0;
  if (limit > 0 && offset > 0) {
    skip = (offset - 1) * limit;
  }

  const data = {
    skip,
    take: limit,
  };

  return data;
}
export function fileToBlob(file, callback) {
  const reader = new FileReader();

  reader.onload = function () {
    const blob = new Blob([reader.result], { type: file.type });
    callback(blob);
  };

  reader.onerror = function (error) {
    console.error('Error reading file:', error);
    callback(null);
  };

  reader.readAsArrayBuffer(file);
}

export async function saveAudioLocally(file: any, filePath: string) {
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(file.buffer, 'base64'); // Convert from base64
    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}

export async function paginationMetaData(
  model: string | string[] | any,
  payload: any,
  whereCondition = {},
) {
  var total = 0;

  if (typeof model == 'string') {
    total = await PrismaClient[model].count({
      where: whereCondition,
    });
  } else {
    total = model.length;
  }

  const limitOffset = await formatLimitOffset(payload);

  const lastPage = Math.ceil(total / limitOffset.limit);
  const data = {
    total: total,
    lastPage: lastPage,
    currentPage: limitOffset.offset,
    perPage: limitOffset.limit,
    prev: limitOffset.offset > 1 ? limitOffset.offset - 1 : null,
    next: limitOffset.offset < lastPage ? limitOffset.offset + 1 : null,
  };

  return data;
}

export async function getAdminSettingsData(slugs?: any) {
  try {
    var data = {};

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

export async function getInstructorSettingsData(user_id: number, slugs?: any) {
  try {
    var data = {};

    if (Array.isArray(slugs)) {
      await Promise.all(
        slugs.map(async (slug) => {
          const slufInfo: any = await PrismaClient.instructorSettings.findFirst(
            {
              where: {
                userId: user_id,
                slug: slug,
              },
            },
          );

          if (slufInfo) {
            data[slug] = slufInfo.value;
          } else {
            data[slug] = null;
          }
        }),
      );
    } else if (typeof slugs === 'string') {
      const slufInfo = await PrismaClient.instructorSettings.findFirst({
        where: {
          userId: user_id,
          slug: slugs,
        },
      });
      data[slugs] = slufInfo.value;
    } else {
      const slugInfoList = await PrismaClient.instructorSettings.findMany();
      slugInfoList.map((item) => {
        data[item.slug] = item.value;
      });
    }
    return data;
  } catch (error) {
    processException(error);
  }
}

export const fetchMyUploadFilePathById = async (uploadId: number) => {
  const uploadDetails = await PrismaClient.myUploads.findFirst({
    where: { id: uploadId },
  });
  return uploadDetails?.file_path || '';
};

export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  const validDiscountPercentage = Math.max(
    0,
    Math.min(discountPercentage, 100),
  );

  const discountAmount = (validDiscountPercentage / 100) * price;

  const discountedPrice = price - discountAmount;

  return Math.round(discountedPrice * 100) / 100;
}

export function getTotalDiscountAmount(totalPrice:number,disCountedAmount:number,discountType:number):number
{
  let totalDiscount = 0;
  if(discountType === DISCOUNT_TYPE.PERCENTAGE)
  {
    totalDiscount = (totalPrice * disCountedAmount)/100;
  }else {
    totalDiscount = disCountedAmount;
  }

  return totalDiscount;
}

export const adminSettingsValueBySlug = async (slug: string) => {
  const adminSettingsData = await PrismaClient.adminSettings.findFirst({
    where: {
      slug: slug,
    },
  });

  return adminSettingsData?.value;
};

export const instructorSettingsValueBySlug = async (
  user_id: number,
  slug: string,
) => {
  const instructorSettingsData =
    await PrismaClient.instructorSettings.findFirst({
      where: {
        userId: user_id,
        slug: slug,
      },
    });

  return instructorSettingsData?.value;
};

const uploadDirectory = `./${coreConstant.FILE_DESTINATION}`;

export const saveBase64ImageAsJpg = (base64Image) => {
  return new Promise((resolve, reject) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}.jpg`;
    const imagePath = path.join(uploadDirectory, fileName);

    const data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(data, 'base64');

    sharp(buffer)
      .jpeg({ quality: 80 })
      .toFile(imagePath, (err, info) => {
        if (err) {
          reject(err);
        } else {
          const imageUrl = `/${coreConstant.FILE_DESTINATION}/${fileName}`;
          resolve({ fileName, imageUrl });
          return imageUrl;
        }
      });
  });
};

export async function generatePromptForCode(
  description: string,
  codingLanguage: string,
  codingLevel: string,
): Promise<string> {
  const prompt = `Generate code for me for ${description} using ${codingLanguage} programing languages. The coding level must be ${codingLevel}`;

  return prompt;
}

export async function generatePromptForTranslate(
  text: string,
  language: string,
) {
  const prompt = `Please translate this text into ${language} language. My text is ${text}`;
  return prompt;
}
export async function generatePromptForJson(topic: string) {
  const prompt = `Please generate a json data only give me result of json. topic is ${topic} i need 5 data's, must provide an object in array and minimum 2 data in the array object's, Prepare data like this [
    {
      "key": "value",
      "key": "value",
      "key": "value"
    }
  ]`;
  return prompt;
}

export async function createSlug(categoryName): Promise<string> {
  // Remove leading and trailing white spaces
  categoryName = categoryName.trim();

  // Replace spaces with hyphens and convert to lowercase
  const slug = categoryName.replace(/\s+/g, '-').toLowerCase();

  return slug;
}

export async function createUniqueSlug(title: string): Promise<string> {
  const originalSlug = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const uniqueSlug = `${originalSlug}-${Math.floor(Math.random() * 10000)}`;

  return uniqueSlug;
}

export async function storeException(
  message: string,
  type?: string,
  error?: any,
) {
  const m = new MyLogger();
  switch (type) {
    case 'error':
      m.error(message, error);
      break;
    case 'info':
      m.info(message);
      break;
    case 'warning':
      m.warn(message);
      break;
    case 'debug':
      m.debug(message);
      break;
    default:
      m.log(message);
  }
}

export async function userRolesPermissionObject(roles: string) {
  const userRoles = roles?.split(',').map((role) => Number(role)) || [];
  const data = {
    is_admin: userRoles.includes(coreConstant.ROLES.ADMIN),
    is_super_admin: userRoles.includes(coreConstant.ROLES.SUPER_ADMIN),
    is_instructor: userRoles.includes(coreConstant.ROLES.INSTRUCTOR),
  };
  return data;
}

export async function checkRoleIsValid(
  roles: string,
  checkRole: number,
): Promise<Boolean> {
  const userRoles = roles?.split(',').map((role) => Number(role)) || [];
  return userRoles.includes(checkRole);
}

export async function CheckEmailNickName(email: string, nickName: string) {
  const checkUniqueEmail = await PrismaClient.user.findUnique({
    where: { email: email },
  });
  if (checkUniqueEmail) {
    return errorResponse('Email already exists', []);
  }
  const checkUniqueNickName = await PrismaClient.user.findUnique({
    where: { user_name: nickName },
  });
  if (checkUniqueNickName) {
    return errorResponse('Nickname already exists', []);
  }
  return successResponse('success', []);
}

export async function removePasswordFromUserList(
  userList: User[],
): Promise<Omit<User, 'password'>[]> {
  const userListWithoutPassword = userList.map((user) => {
    const { password, ...userWithoutPassword } = user;
    userWithoutPassword.photo = userWithoutPassword.photo
      ? addPhotoPrefix(user.photo)
      : null;
    return userWithoutPassword;
  });

  return userListWithoutPassword;
}

export async function updateOrCreateAdminSettings(slugKey: any, values: any) {
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

export async function generatePageArray(
  totalLength: number,
  itemsPerPage: number = 1,
) {
  const pageCount = Math.ceil(totalLength / itemsPerPage);
  return Array.from({ length: pageCount }, (_, index) => index + 1);
}

export async function getRandomPageNumberExcluding(
  array1: number[],
  visited_offset: string = null,
  nextPage: boolean = false,
  currentPage?: number,
) {
  const visitedOffsetArray = visited_offset
    ? visited_offset.split(',').map(Number)
    : [];

  if (nextPage) {
    visitedOffsetArray.push(currentPage);
  }

  const validNumbers = array1.filter(
    (num) => !visitedOffsetArray.includes(num),
  );

  if (validNumbers.length === 0 && !nextPage) {
    return visitedOffsetArray.pop();
  }
  console.log(' validNumbers.length', validNumbers.length);
  if (validNumbers.length === 0 && nextPage) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * validNumbers.length);

  return validNumbers[randomIndex];
}

export async function paginatioOptionsRandomly(
  totalItems: number,
  payload: any,
) {
  const limitOffset = await formatLimitOffset(payload);
  const limit = limitOffset.limit;
  let offset = limitOffset.offset;

  const pageList = await generatePageArray(totalItems, limit);

  offset = payload.visited_offset
    ? offset
    : await getRandomPageNumberExcluding(pageList, payload.visited_offset);

  let skip = 0;
  if (limit > 0 && offset > 0) {
    skip = (offset - 1) * limit;
  }

  const data = {
    skip,
    take: limit,
  };

  return data;
}

export async function paginationMetaDataRandomly(
  totalItems: number,
  currentPage: number,
  payload: any,
) {
  const limitOffset = await formatLimitOffset(payload);
  const limit = limitOffset.limit;

  const pageList = await generatePageArray(totalItems, limit);
  const totalPageList = await generatePageArray(totalItems, limit);

  const visitedOffsetArray = payload.visited_offset
    ? payload.visited_offset.split(',').map(Number)
    : [];

  const data = {
    total: totalItems,
    lastPage: pageList.pop(),
    currentPage: currentPage,
    perPage: limit,
    prev: visitedOffsetArray.pop() ?? null,
    next: await getRandomPageNumberExcluding(
      totalPageList,
      payload.visited_offset,
      true,
      currentPage,
    ),
  };
  return data;
}

export async function checkTwoArraysAreEqual(
  array1: any[],
  array2: any[],
): Promise<boolean> {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }

  return true;
}

export async function convertMinutesToHoursAndMinutes(minutes: number) {
  // Calculate hours and remaining minutes
  var hours = Math.floor(minutes / 60);
  var remainingMinutes = minutes % 60;

  // Format the result
  var result = hours + ' hours';
  if (remainingMinutes > 0) {
    result += ' and ' + remainingMinutes + ' minutes';
  }

  return result;
}

export async function formatDateTime(date) {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  var day = String(date.getDate()).padStart(2, '0');
  var hour = String(date.getHours()).padStart(2, '0');
  var minute = String(date.getMinutes()).padStart(2, '0');
  var second = String(date.getSeconds()).padStart(2, '0');

  var formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  return formattedDate;
}
export async function generateAccessTokenFunction(
  appID: string,
  appCertificate: string,
  channelName: string,
  uid: number,
  expirationTimeInSeconds: number,
  role: any,
): Promise<string> {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs,
    );
    return token;
  } catch (error) {
    console.error('Error generating Agora access token:', error);
    throw error;
  }
}
export function generateChannelName(title: string): string {
  const sanitizedTitle = title.replace(/\s+/g, '_');
  const uniqueIdentifier = Date.now(); // Using timestamp as a unique identifier

  const channelName = `${sanitizedTitle}_${uniqueIdentifier}`;

  const maxLength = 50;
  return channelName.substring(0, maxLength);
}
