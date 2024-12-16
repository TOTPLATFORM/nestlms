import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuizService } from '../quiz.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from 'src/modules/users/entities/user.entity';
import { StoreQuizByInstructorDto } from './dto/store-quiz-instructor.dto';
import { IsInstructor } from 'src/shared/decorators/is-instructor.decorator';
import { StoreQuizQuestionDto } from './dto/store-quiz-question.dto';
import { userInfo } from 'os';
import { StoreQuizQuestionAnswerDto } from './dto/store-quiz-question-answer.dto';

@IsInstructor()
@Controller('instructor')
export class InstructorQuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post('create-quiz')
  createQuizByInstructor(
    @UserInfo() user: User,
    @Body() payload: StoreQuizByInstructorDto,
  ) {
    return this.quizService.createQuizByInstructor(user, payload);
  }

  @Get('quiz-list-:course_id')
  getQuizListForInstructor(
    @UserInfo() user: User,
    @Param('course_id', ParseIntPipe) course_id: number,
    @Query() payload: any,
  ) {
    return this.quizService.getQuizListForInstructor(user, course_id, payload);
  }
  @Get('quiz-details-:id')
  getQuizDetails(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo() user: User,
  ) {
    return this.quizService.getQuizDetails(id, user);
  }

  @Put('update-quiz-:id')
  updateQuizByInstructor(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: StoreQuizByInstructorDto,
  ) {
    return this.quizService.updateQuizByInstructor(user, id, payload);
  }

  @Delete('delete-quiz-details-:id')
  deleteQuizDetailsByInstructor(
    @UserInfo() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.quizService.deleteQuizDetailsByInstructor(user, id);
  }

  @Post('create-quiz-question')
  createQuizQuestionByInstructor(
    @UserInfo() user: User,
    @Body() payload: StoreQuizQuestionDto,
  ) {
    return this.quizService.createQuizQuestionByInstructor(user, payload);
  }

  @Get('quiz-question-list-:quiz_id')
  getQuizQuestionList(
    @UserInfo() user: User,
    @Param('quiz_id', ParseIntPipe) quiz_id: number,
    @Query() payload: any,
  ) {
    return this.quizService.getQuizQuestionList(user, quiz_id, payload);
  }

  @Get('quiz-question-details-:quiz_question_id')
  getQuizQuestionDetails(
    @UserInfo() user: User,
    @Param('quiz_question_id', ParseIntPipe) quiz_question_id: number,
  ) {
    return this.quizService.getQuizQuestionDetails(user, quiz_question_id);
  }

  @Put('update-question-:quiz_question_id')
  updateQuizQuestionByInstructor(
    @UserInfo() user: User,
    @Param('quiz_question_id', ParseIntPipe) quiz_question_id: number,
    @Body() payload: StoreQuizQuestionDto,
  ) {
    return this.quizService.updateQuizQuestionByInstructor(
      user,
      quiz_question_id,
      payload,
    );
  }

  @Delete('delete-quiz-question-:quiz_question_id')
  deleteQuizQuestion(
    @UserInfo() user: User,
    @Param('quiz_question_id', ParseIntPipe) quiz_question_id: number,
  ) {
    return this.quizService.deleteQuizQuestion(user, quiz_question_id);
  }

  @Post('create-question-answer')
  createQuestionAnswer(
    @UserInfo() user: User,
    @Body() payload: StoreQuizQuestionAnswerDto,
  ) {
    return this.quizService.createQuestionAnswer(user, payload);
  }

  @Get('quiz-question-answer-list-:quiz_question_id')
  getQuizQuestionAnswerList(
    @UserInfo() user: User,
    @Param('quiz_question_id', ParseIntPipe) quiz_question_id: number,
  ) {
    return this.quizService.getQuizQuestionAnswerList(user, quiz_question_id);
  }

  @Get('quiz-question-answer-detail-:quiz_question_answer_id')
  getQuizQuestionAnswerDetails(
    @UserInfo() user: User,
    @Param('quiz_question_answer_id', ParseIntPipe)
    quiz_question_answer_id: number,
  ) {
    return this.quizService.getQuizQuestionAnswerDetails(
      user,
      quiz_question_answer_id,
    );
  }

  @Put('update-answer-:quiz_question_answer_id')
  updateQuestionAnswer(
    @UserInfo() user: User,
    @Param('quiz_question_answer_id', ParseIntPipe)
    quiz_question_answer_id: number,
    @Body() payload: StoreQuizQuestionAnswerDto,
  ) {
    return this.quizService.updateQuestionAnswer(
      user,
      quiz_question_answer_id,
      payload,
    );
  }
  @Delete('delete-answer-:quiz_question_answer_id')
  deleteQuizQuestionAnswer(
    @UserInfo() user: User,
    @Param('quiz_question_answer_id', ParseIntPipe)
    quiz_question_answer_id: number,
  ) {
    return this.quizService.deleteQuizQuestionAnswer(
      user,
      quiz_question_answer_id,
    );
  }
}
