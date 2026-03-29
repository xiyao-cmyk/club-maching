import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { QuestionnaireService } from './questionnaire.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('问卷')
@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  @Get('questions')
  @ApiOperation({ summary: '获取问卷题目' })
  getQuestions() {
    return this.questionnaireService.getQuestions();
  }

  @Get('my-answers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的问卷答案' })
  getMyAnswers(@CurrentUser() user: User) {
    return this.questionnaireService.getMyAnswers(user.id);
  }

  @Post('answers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '提交问卷答案' })
  saveAnswers(
    @CurrentUser() user: User,
    @Body() body: { answers: Record<number, any>; completed?: boolean },
  ) {
    return this.questionnaireService.saveAnswers(user.id, body.answers, body.completed ?? false);
  }
}
