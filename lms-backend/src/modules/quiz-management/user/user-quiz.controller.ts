import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { QuizService } from '../quiz.service';
import { UserInfo } from 'src/shared/decorators/user.decorators';
import { User } from 'src/modules/users/entities/user.entity';
import { SaveQuizQuestionAnsDto } from './dto/save-quiz-question-ans.dto';

@Controller('user')
export class UserQuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('quiz-details-:quiz_id')
  getQuizQuestionAnswerDetailsForStudent(
    @UserInfo() user: User,
    @Param('quiz_id', ParseIntPipe) quiz_id: number,
  ) {
    return this.quizService.getQuizQuestionAnswerDetailsForStudent(
      user,
      quiz_id,
    );
  }

  @Get('start-quiz-:quiz_id')
  getQuizQuestionListForUser(
    @UserInfo() user: User,
    @Param('quiz_id', ParseIntPipe) quiz_id: number,
    @Query() payload: any,
  ) {
    return this.quizService.getQuizQuestionListForUser(user, quiz_id, payload);
  }

  @Post('save-quiz-question-ans')
  saveQuizQuestionAnswerByUser(
    @UserInfo() user: User,
    @Body() payload: SaveQuizQuestionAnsDto,
  ) {
    return this.quizService.saveQuizQuestionAnswerByUser(user, payload);
  }

  @Get('quiz-result-details-:quiz_id')
  getQuizResultDetailsForUser(
    @UserInfo() user: User,
    @Param('quiz_id', ParseIntPipe) quiz_id: number,
  ) {
    return this.quizService.getQuizResultDetailsForUser(user, quiz_id);
  }
}
