import { Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import * as handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import {
  PrismaClient,
  addPhotoPrefix,
  adminSettingsValueBySlug,
  convertMinutesToHoursAndMinutes,
  errorResponse,
  formatDateTime,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import { User } from '../users/entities/user.entity';
import { coreConstant } from 'src/shared/helpers/coreConstant';
import fs from 'fs';

const readFileAsync = promisify(readFile);

@Injectable()
export class CertificateService {
  private async loadTemplate(templatePath: string): Promise<string> {
    const fullPath = path.join(
      process.cwd(),
      'src',
      'modules',
      'certificate-management',
      'templates',
      templatePath,
    );
    return await readFileAsync(fullPath, 'utf8');
  }

  private async checkCertificateVerification(user: User, course_id: number) {
    const courseDetails = await PrismaClient.course.findFirst({
      where: {
        id: course_id,
      },
      include: {
        User: true,
        Lesson: true,
        Quiz: true,
      },
    });

    if (!courseDetails) {
      return errorResponse('Invalid Course!');
    }

    const checkEnrolled = await PrismaClient.courseEnrollment.findFirst({
      where: {
        course_id: courseDetails.id,
        user_id: user.id,
      },
    });

    if (!checkEnrolled) {
      return errorResponse('You are not enrolled in this course!');
    }

    const userCompletedLession = await PrismaClient.userLession.findMany({
      where: {
        userId: user.id,
        courseId: courseDetails.id,
        is_completed: true,
      },
    });

    if (courseDetails.Lesson.length !== userCompletedLession.length) {
      return errorResponse(
        'You are not eligible for get certificate, because you do not complete your all lession!',
      );
    }

    const userCompletedQuizList = await PrismaClient.userQuiz.groupBy({
      by: ['quizId'],
      where: {
        studentId: user.id,
        courseId: courseDetails.id,
        is_completed: coreConstant.STATUS_ACTIVE,
      },
    });

    if (courseDetails.Quiz.length !== userCompletedQuizList.length) {
      return errorResponse(
        'You are not eligible for get certificate, because you do not give all quiz!',
      );
    }

    const data = {
      course_details: courseDetails,
    };

    return successResponse('you are eligible to get certificate!', data);
  }

  async generateCertificate(user: User, course_id: number) {
    try {
      const checkEligibilityForCertificate: any =
        await this.checkCertificateVerification(user, course_id);

      if (!checkEligibilityForCertificate.success) {
        return checkEligibilityForCertificate;
      }

      const courseDetails = checkEligibilityForCertificate.data.course_details;

      const checkEnrolled = await PrismaClient.courseEnrollment.findFirst({
        where: {
          course_id: course_id,
          user_id: user.id,
        },
      });

      if (!checkEnrolled) {
        return errorResponse('You are not enrolled in this course!');
      }

      const htmlTemplate = await this.loadTemplate('template.hbs');

      const compiledTemplate = handlebars.compile(htmlTemplate);
      let duration = await convertMinutesToHoursAndMinutes(
        courseDetails.duration,
      );

      const compile_data = {
        student_name: user.first_name + ' ' + user.last_name,
        duration: duration,
        course_title: courseDetails.name,
        complete_date: await formatDateTime(checkEnrolled.created_at),
        instructor_name:
          courseDetails.User.first_name + ' ' + courseDetails.User.last_name,
        site_name: (await adminSettingsValueBySlug('site_name')) || 'N/A',
      };
      const renderedContent = compiledTemplate(compile_data);

      const browser = await puppeteer.launch({
        headless: 'new', // Pass 'new' to opt-in to the new Headless mode
      });

      const page = await browser.newPage();
      // await page.setViewport({width: 800, height: 600});
      await page.setContent(renderedContent, { waitUntil: 'domcontentloaded' });

      const uploadDirectory = `./storage/certificate/`;
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory);
      }

      const certificate_path =
        'storage/certificate/' +
        user.first_name +
        '-' +
        user.id +
        '-' +
        courseDetails.id +
        '.pdf';

      await page.emulateMediaType('screen');

      const pdf = await page.pdf({
        path: certificate_path,
        margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
        printBackground: true,
        format: 'A4',
      });

      await browser.close();

      const data = {
        file_path: addPhotoPrefix('/' + certificate_path),
      };
      return successResponse('Certificate generate is done!', data);
    } catch (error) {
      processException(error);
    }
  }
}
