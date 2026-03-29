import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireQuestion } from '../../entities/questionnaire-question.entity';
import { QuestionnaireAnswer } from '../../entities/questionnaire-answer.entity';
import { StudentProfile } from '../../entities/student-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionnaireQuestion, QuestionnaireAnswer, StudentProfile])],
  providers: [QuestionnaireService],
  controllers: [QuestionnaireController],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}
