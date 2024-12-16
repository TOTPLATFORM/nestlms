import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { StoreQuizByInstructorDto } from './instructor/dto/store-quiz-instructor.dto';
import {
  PrismaClient,
  checkTwoArraysAreEqual,
  errorResponse,
  fetchMyUploadFilePathById,
  generatePageArray,
  getRandomPageNumberExcluding,
  paginatioOptions,
  paginatioOptionsRandomly,
  paginationMetaData,
  paginationMetaDataRandomly,
  processException,
  successResponse,
} from 'src/shared/helpers/functions';
import {
  AnswerStatusConstant,
  AnswerTypeConstant,
  FileTypeConstant,
  coreConstant,
} from 'src/shared/helpers/coreConstant';
import { StoreQuizQuestionDto } from './instructor/dto/store-quiz-question.dto';
import { StoreQuizQuestionAnswerDto } from './instructor/dto/store-quiz-question-answer.dto';
import { SaveQuizQuestionAnsDto } from './user/dto/save-quiz-question-ans.dto';

@Injectable()
export class QuizService {
  async createQuizByInstructor(user: User, payload: StoreQuizByInstructorDto) {
    try {
      const existsCourse = await PrismaClient.course.findFirst({
        where: {
          id: payload.course_id,
          instructorId: user.id,
          Section: {
            some: {
              id: payload.section_id,
            },
          },
        },
      });

      if (!existsCourse) {
        return errorResponse('Invalid Course!');
      }

      if (
        payload.display_limited_qus === coreConstant.STATUS_ACTIVE &&
        !payload.qus_limit
      ) {
        return errorResponse('Question limited is required!');
      }

      const quizDetails = await PrismaClient.quiz.create({
        data: {
          courseId: payload.course_id,
          sectionId: payload.section_id,
          userId: user.id,
          title: payload.title,
          time: payload.time,
          max_attempts: payload.max_attempts,
          pass_mark: payload.pass_mark,
          expiry_days: payload.expiry_days,
          display_qus_randomly: payload.display_qus_randomly,
          display_limited_qus: payload.display_limited_qus,
          qus_limit: payload.qus_limit ?? 0,
          certificate_included: payload.certificate_included,
          status: payload.status,
        },
      });

      return successResponse('Quiz is created successfully!', quizDetails);
    } catch (error) {
      processException(error);
    }
  }

  async getQuizListForInstructor(user: User, course_id: number, payload: any) {
    try {
      const whereCondition = {
        userId: user.id,
        courseId: course_id,
      };
      const quizList = await PrismaClient.quiz.findMany({
        where: whereCondition,
        include: {
          QuizQuestion: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      quizList.map((item) => {
        item['total_question'] = item.QuizQuestion.length;

        delete item.QuizQuestion;
      });

      const data = {
        list: quizList,
      };

      return successResponse('Quiz list for instructor!', data);
    } catch (error) {
      processException(error);
    }
  }

  async getQuizDetails(quize_id: number, user: User) {
    try {
      const quizDetails = await PrismaClient.quiz.findFirst({
        where: {
          id: quize_id,
          userId: user.id,
        },
      });

      if (!quizDetails) return errorResponse('Invalid Request!');

      return successResponse('Quize details', quizDetails);
    } catch (error) {
      processException(error);
    }
  }

  async updateQuizByInstructor(
    user: User,
    id: number,
    payload: StoreQuizByInstructorDto,
  ) {
    try {
      const existsQuiz = await PrismaClient.quiz.findFirst({
        where: {
          id: id,
          userId: user.id,
        },
      });
      if (!existsQuiz) return errorResponse('Invalid Request!');

      const existsCourse = await PrismaClient.course.findFirst({
        where: {
          id: payload.course_id,
          instructorId: user.id,
          Section: {
            some: {
              id: payload.section_id,
            },
          },
        },
      });

      if (!existsCourse) {
        return errorResponse('Invalid Course!');
      }

      if (
        payload.display_limited_qus === coreConstant.STATUS_ACTIVE &&
        !payload.qus_limit
      ) {
        return errorResponse('Question limited is required!');
      }

      const quizeDetails = await PrismaClient.quiz.update({
        where: {
          id: existsQuiz.id,
        },
        data: {
          courseId: payload.course_id,
          sectionId: payload.section_id,
          userId: user.id,
          title: payload.title,
          time: payload.time,
          max_attempts: payload.max_attempts,
          pass_mark: payload.pass_mark,
          expiry_days: payload.expiry_days,
          display_qus_randomly: payload.display_qus_randomly,
          display_limited_qus: payload.display_limited_qus,
          qus_limit: payload.qus_limit ?? 0,
          certificate_included: payload.certificate_included,
          status: payload.status,
        },
      });

      return successResponse('Quiz is updated successfully!', quizeDetails);
    } catch (error) {
      processException(error);
    }
  }

  async deleteQuizDetailsByInstructor(user: User, quiz_id: number) {
    try {
      const existsQuiz = await PrismaClient.quiz.findFirst({
        where: {
          id: quiz_id,
          userId: user.id,
        },
      });

      if (!existsQuiz) return errorResponse('Invalid request!');

      const checkQuizAttend = await PrismaClient.userQuiz.findMany({
        where: {
          quizId: existsQuiz.id,
        },
      });

      if (checkQuizAttend) {
        return errorResponse(
          'This quiz is already attend, you can not delete this!',
        );
      }

      await PrismaClient.quiz.delete({
        where: {
          id: existsQuiz.id,
        },
      });
      return successResponse('Quiz details is removed successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async createQuizQuestionByInstructor(
    user: User,
    payload: StoreQuizQuestionDto,
  ) {
    try {
      const quizDetails = await PrismaClient.quiz.findFirst({
        where: {
          id: payload.quiz_id,
          courseId: payload.course_id,
          userId: user.id,
        },
      });
      if (!quizDetails) {
        return errorResponse('Invalid Request!');
      }
      if (payload.file_type !== FileTypeConstant.NONE && !payload.file_url) {
        return errorResponse('Please, insert a image or video!');
      }

      const file_url = payload.file_url
        ? await fetchMyUploadFilePathById(payload.file_url)
        : null;

      const quizQuestion = await PrismaClient.quizQuestion.create({
        data: {
          title: payload.title,
          mark: payload.mark,
          file_type: payload.file_type,
          file_url: file_url,
          courseId: quizDetails.courseId,
          quizId: quizDetails.id,
          userId: user.id,
        },
      });

      return successResponse('Question is created successfully!', quizQuestion);
    } catch (error) {
      processException(error);
    }
  }

  async getQuizQuestionList(user: User, quiz_id: number, payload: any) {
    try {
      const questionList = await PrismaClient.quizQuestion.findMany({
        where: {
          userId: user.id,
          quizId: quiz_id,
        },
      });

      return successResponse('Quiz question list', questionList);
    } catch (error) {
      processException(error);
    }
  }

  async getQuizQuestionDetails(user: User, quiz_question_id: number) {
    try {
      const questionDetails = await PrismaClient.quizQuestion.findFirst({
        where: {
          id: quiz_question_id,
          userId: user.id,
        },
      });

      if (!questionDetails) {
        return errorResponse('Invalid Request!');
      }

      return successResponse('Quiz question details', questionDetails);
    } catch (error) {
      processException(error);
    }
  }

  async updateQuizQuestionByInstructor(
    user: User,
    quiz_question_id: number,
    payload: StoreQuizQuestionDto,
  ) {
    try {
      const existsQuizQuestion = await PrismaClient.quizQuestion.findFirst({
        where: {
          id: quiz_question_id,
          userId: user.id,
        },
      });

      if (!existsQuizQuestion) {
        return errorResponse('Invalid Request!');
      }

      const quizDetails = await PrismaClient.quiz.findFirst({
        where: {
          id: payload.quiz_id,
          courseId: payload.course_id,
          userId: user.id,
        },
      });
      if (!quizDetails) {
        return errorResponse('Invalid Request!');
      }
      if (payload.file_type !== FileTypeConstant.NONE && !payload.file_url) {
        return errorResponse('Please, insert a image or video!');
      }

      const file_url = payload.file_url
        ? await fetchMyUploadFilePathById(payload.file_url)
        : existsQuizQuestion.file_url;

      const quizQuestion = await PrismaClient.quizQuestion.update({
        where: {
          id: existsQuizQuestion.id,
        },
        data: {
          title: payload.title,
          mark: payload.mark,
          file_type: payload.file_type,
          file_url: file_url,
          courseId: quizDetails.courseId,
          quizId: quizDetails.id,
          userId: user.id,
        },
      });

      return successResponse('Question is updated successfully!', quizQuestion);
    } catch (error) {
      processException(error);
    }
  }

  async deleteQuizQuestion(user: User, quiz_question_id: number) {
    try {
      const questionDetails = await PrismaClient.quizQuestion.findFirst({
        where: {
          id: quiz_question_id,
          userId: user.id,
        },
      });

      if (!questionDetails) {
        return errorResponse('Invalid Request!');
      }

      const checkQuizAttend = await PrismaClient.userQuizAnswer.findMany({
        where: {
          quizQuestionId: questionDetails.id,
        },
      });

      if (checkQuizAttend) {
        return errorResponse(
          'This quiz question answer is already attend, you can not delete this!',
        );
      }

      await PrismaClient.quizQuestion.delete({
        where: {
          id: questionDetails.id,
        },
      });

      return successResponse('Quiz question is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async createQuestionAnswer(user: User, payload: StoreQuizQuestionAnswerDto) {
    try {
      const existsQuestion = await PrismaClient.quizQuestion.findFirst({
        where: {
          id: payload.quiz_question_id,
          quizId: payload.quiz_id,
          userId: user.id,
        },
      });
      if (!existsQuestion) {
        return errorResponse('Invalid Request!');
      }

      const file_url = payload.file_url
        ? await fetchMyUploadFilePathById(payload.file_url)
        : null;

      const answerDetails = await PrismaClient.quizQuestionAnswer.create({
        data: {
          title: payload.title,
          is_correct: payload.is_correct,
          file_url: file_url,
          quizId: existsQuestion.quizId,
          quizQuestionId: existsQuestion.id,
          userId: user.id,
        },
      });

      return successResponse('Answer is created successfully!', answerDetails);
    } catch (error) {
      processException(error);
    }
  }

  async getQuizQuestionAnswerList(user: User, quiz_question_id: number) {
    try {
      const answerList = await PrismaClient.quizQuestionAnswer.findMany({
        where: {
          quizQuestionId: quiz_question_id,
          userId: user.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      return successResponse('Question answer list', answerList);
    } catch (error) {
      processException(error);
    }
  }

  async getQuizQuestionAnswerDetails(
    user: User,
    quiz_question_answer_id: number,
  ) {
    try {
      const answerDetails = await PrismaClient.quizQuestionAnswer.findFirst({
        where: {
          id: quiz_question_answer_id,
          userId: user.id,
        },
      });
      if (!answerDetails) {
        return errorResponse('Invalid Request!');
      }

      return successResponse('Quiz question answer details', answerDetails);
    } catch (error) {
      processException(error);
    }
  }

  async updateQuestionAnswer(
    user: User,
    quiz_question_answer_id: number,
    payload: StoreQuizQuestionAnswerDto,
  ) {
    try {
      const existsQuestionAnswer =
        await PrismaClient.quizQuestionAnswer.findFirst({
          where: {
            id: quiz_question_answer_id,
            userId: user.id,
          },
        });

      if (!existsQuestionAnswer) {
        return errorResponse('Invalid Request!');
      }

      const existsQuestion = await PrismaClient.quizQuestion.findFirst({
        where: {
          id: payload.quiz_question_id,
          quizId: payload.quiz_id,
          userId: user.id,
        },
      });
      if (!existsQuestion) {
        return errorResponse('Invalid Request!');
      }

      const file_url = payload.file_url
        ? await fetchMyUploadFilePathById(payload.file_url)
        : existsQuestionAnswer.file_url;

      const answerDetails = await PrismaClient.quizQuestionAnswer.update({
        where: {
          id: existsQuestionAnswer.id,
        },
        data: {
          title: payload.title,
          is_correct: payload.is_correct,
          file_url: file_url,
          quizId: existsQuestion.quizId,
          quizQuestionId: existsQuestion.id,
          userId: user.id,
        },
      });

      return successResponse('Answer is updated successfully!', answerDetails);
    } catch (error) {
      processException(error);
    }
  }

  async deleteQuizQuestionAnswer(user: User, quiz_question_answer_id: number) {
    try {
      const answerDetails = await PrismaClient.quizQuestionAnswer.findFirst({
        where: {
          id: quiz_question_answer_id,
          userId: user.id,
        },
      });
      if (!answerDetails) {
        return errorResponse('Invalid Request!');
      }

      const checkQuizAttend = await PrismaClient.userQuizAnswer.findMany({
        where: {
          quizQuestionId: answerDetails.quizQuestionId,
        },
      });

      if (checkQuizAttend) {
        return errorResponse(
          'This quiz question answer is already attend, you can not delete this!',
        );
      }

      await PrismaClient.quizQuestionAnswer.delete({
        where: {
          id: answerDetails.id,
        },
      });

      return successResponse('Quiz question answer is deleted successfully!');
    } catch (error) {
      processException(error);
    }
  }

  async getQuizQuestionAnswerDetailsForStudent(user: User, quiz_id: number) {
    try {
      const quizDetails = await PrismaClient.quiz.findFirst({
        where: {
          id: quiz_id,
          status: coreConstant.STATUS_ACTIVE,
        },
        include: {
          QuizQuestion: true,
        },
      });

      if (!quizDetails) {
        return errorResponse('Invalid Request!');
      }

      const existsCourseEnrollment =
        await PrismaClient.courseEnrollment.findFirst({
          where: {
            course_id: quizDetails.courseId,
            user_id: user.id,
          },
        });

      if (!existsCourseEnrollment) {
        return errorResponse('Invalid Request!');
      }

      quizDetails['total_question'] = quizDetails.QuizQuestion.length;

      delete quizDetails.QuizQuestion;

      return successResponse('Quiz details', quizDetails);
    } catch (error) {
      processException(error);
    }
  }
  private async getQuizQuestionSequentially(payload: any, whereCondition = {}) {
    const paginate = await paginatioOptions(payload);
    const questionList = await PrismaClient.quizQuestion.findMany({
      where: whereCondition,
      include: {
        QuizQuestionAnswer: {
          select: {
            id: true,
            title: true,
            file_url: true,
          },
        },
      },
      ...paginate,
    });

    const data = {
      list: questionList,
      meta: await paginationMetaData('quizQuestion', payload, whereCondition),
    };

    return successResponse('Quiz question list sequentially!', data);
  }
  private async getQuizQuestionRandomly(payload: any, whereCondition: {}) {
    const totalItems = await PrismaClient.quizQuestion.count({
      where: whereCondition,
    });

    const paginate = await paginatioOptionsRandomly(totalItems, payload);

    const questionList = await PrismaClient.quizQuestion.findMany({
      where: whereCondition,
      include: {
        QuizQuestionAnswer: {
          select: {
            id: true,
            title: true,
            file_url: true,
          },
        },
      },
      ...paginate,
    });

    const data = {
      list: questionList,
      meta: await paginationMetaDataRandomly(
        totalItems,
        paginate.skip + 1,
        payload,
      ),
    };

    return successResponse('Quiz question list randomly!', data);
  }
  async getQuizQuestionListForUser(user: User, quiz_id: number, payload: any) {
    try {
      const quizDetails = await PrismaClient.quiz.findFirst({
        where: {
          id: quiz_id,
          status: coreConstant.STATUS_ACTIVE,
        },
      });

      if (!quizDetails) {
        return errorResponse('Invalid Request!');
      }

      const existsCourseEnrollment =
        await PrismaClient.courseEnrollment.findFirst({
          where: {
            course_id: quizDetails.courseId,
            user_id: user.id,
          },
        });

      if (!existsCourseEnrollment) {
        return errorResponse('Invalid Request!');
      }

      const whereCondition = {
        quizId: quizDetails.id,
      };

      if (!payload.visited_offset) {
        const countAttempts = await PrismaClient.userQuiz.count({
          where: {
            studentId: user.id,
            quizId: quizDetails.id,
            courseId: quizDetails.courseId,
          },
        });

        if (
          countAttempts < quizDetails.max_attempts ||
          quizDetails.max_attempts === 0
        ) {
          await PrismaClient.userQuiz.create({
            data: {
              studentId: user.id,
              instructorId: quizDetails.userId,
              quizId: quizDetails.id,
              courseId: quizDetails.courseId,
              pass_mark: quizDetails.pass_mark,
            },
          });
        } else {
          return errorResponse('Your quiz max attempts limit is over!');
        }
      }

      if (quizDetails.display_qus_randomly === coreConstant.STATUS_ACTIVE) {
        const response = await this.getQuizQuestionRandomly(
          payload,
          whereCondition,
        );

        return response;
      } else {
        const response = await this.getQuizQuestionSequentially(
          payload,
          whereCondition,
        );

        return response;
      }
    } catch (error) {
      processException(error);
    }
  }

  async saveQuizQuestionAnswerByUser(
    user: User,
    payload: SaveQuizQuestionAnsDto,
  ) {
    try {
      const existsQuizQuestion = await PrismaClient.quizQuestion.findFirst({
        where: {
          id: payload.quiz_question_id,
          quizId: payload.quiz_id,
        },
      });
      if (!existsQuizQuestion) {
        return errorResponse('Invalid Request!');
      }
      const userLastAttemptsQuiz = await PrismaClient.userQuiz.findFirst({
        where: {
          studentId: user.id,
          quizId: existsQuizQuestion.quizId,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      if (!userLastAttemptsQuiz) {
        return errorResponse('Invalid Request!');
      }

      if (userLastAttemptsQuiz.is_completed) {
        return errorResponse('You already completed this quiz!');
      }

      const givenAnswerArray = payload.answer.split(',').map(Number);
      const questionAnswerList = await PrismaClient.quizQuestionAnswer.findMany(
        {
          where: {
            is_correct: AnswerStatusConstant.RIGHT_ANSWER,
            quizId: existsQuizQuestion.quizId,
            quizQuestionId: existsQuizQuestion.id,
            userId: existsQuizQuestion.userId,
          },
        },
      );
      const questionAnswerArray = questionAnswerList.map((item) => item.id);
      const isEqual = await checkTwoArraysAreEqual(
        questionAnswerArray,
        givenAnswerArray,
      );

      const checkAlreadyAnswer = await PrismaClient.userQuizAnswer.findFirst({
        where: {
          studentId: user.id,
          quizId: existsQuizQuestion.quizId,
          quizQuestionId: existsQuizQuestion.id,
          userQuizId: userLastAttemptsQuiz.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (checkAlreadyAnswer) {
        await PrismaClient.userQuizAnswer.update({
          where: {
            id: checkAlreadyAnswer.id,
          },
          data: {
            answer: payload.answer,
            mark: isEqual ? existsQuizQuestion.mark : 0,
            is_correct: isEqual
              ? AnswerStatusConstant.RIGHT_ANSWER
              : AnswerStatusConstant.WRONG_ANSWER,
          },
        });
      } else {
        await PrismaClient.userQuizAnswer.create({
          data: {
            studentId: user.id,
            quizId: existsQuizQuestion.quizId,
            quizQuestionId: existsQuizQuestion.id,
            userQuizId: userLastAttemptsQuiz.id,
            answer: payload.answer,
            mark: isEqual ? existsQuizQuestion.mark : 0,
            is_correct: isEqual
              ? AnswerStatusConstant.RIGHT_ANSWER
              : AnswerStatusConstant.WRONG_ANSWER,
          },
        });
      }

      const totalQuestionMark = await PrismaClient.quizQuestion.aggregate({
        where: {
          quizId: existsQuizQuestion.quizId,
        },
        _sum: {
          mark: true,
        },
      });

      const totalRightAnswerMark = await PrismaClient.userQuizAnswer.aggregate({
        where: {
          studentId: user.id,
          quizId: existsQuizQuestion.quizId,
          userQuizId: userLastAttemptsQuiz.id,
          is_correct: AnswerStatusConstant.RIGHT_ANSWER,
        },
        _sum: {
          mark: true,
        },
      });

      const isDone =
        totalQuestionMark._sum.mark === totalRightAnswerMark._sum.mark
          ? true
          : false;
      await PrismaClient.userQuiz.update({
        where: {
          id: userLastAttemptsQuiz.id,
        },
        data: {
          total_marks: totalRightAnswerMark._sum.mark || 0,
          is_completed: isDone ? 1 : 0,
        },
      });
      return successResponse('Question is saved!');
    } catch (error) {
      processException(error);
    }
  }

  async getQuizResultDetailsForUser(user: User, quiz_id: number) {
    try {
      const quizDetails = await PrismaClient.quiz.findFirst({
        where: {
          id: quiz_id,
          status: coreConstant.STATUS_ACTIVE,
        },
        include: {
          QuizQuestion: true,
        },
      });

      if (!quizDetails) {
        return errorResponse('Invalid Request!');
      }

      const existsCourseEnrollment =
        await PrismaClient.courseEnrollment.findFirst({
          where: {
            course_id: quizDetails.courseId,
            user_id: user.id,
          },
        });

      if (!existsCourseEnrollment) {
        return errorResponse('Invalid Request!');
      }

      const userQuizDetails = await PrismaClient.userQuiz.findFirst({
        where: {
          quizId: quizDetails.id,
          studentId: user.id,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const courseDetails = await PrismaClient.course.findFirst({
        where: {
          id: quizDetails.courseId,
        },
        include: {
          Lesson: true,
          Quiz: true,
          UserLession: {
            where: {
              userId: user.id,
              courseId: quizDetails.courseId,
              is_completed: true,
            },
          },
          UserQuiz: {
            where: {
              quizId: quizDetails.id,
              studentId: user.id,
            },
          },
        },
      });

      const userCompletedQuizList = await PrismaClient.userQuiz.groupBy({
        by: ['quizId'],
        where: {
          studentId: user.id,
          courseId: quizDetails.courseId,
          is_completed: coreConstant.STATUS_ACTIVE,
        },
      });

      const totalCompletePercentage =
        ((courseDetails.UserLession.length + userCompletedQuizList.length) *
          100) /
        (courseDetails.Lesson.length + courseDetails.Quiz.length);

      const data = {
        user_quiz_details: userQuizDetails,
        total_complete_percentage: totalCompletePercentage.toFixed(2),
      };

      return successResponse('Quiz Result details', data);
    } catch (error) {
      processException(error);
    }
  }
}
