import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { InstructorQuizController } from './instructor/instructor-quize.controller';
import { UserQuizController } from './user/user-quiz.controller';

@Module({
  providers: [QuizService],
  controllers: [InstructorQuizController, UserQuizController],
})
export class QuizModule {}
