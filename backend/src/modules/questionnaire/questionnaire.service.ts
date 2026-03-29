import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionnaireQuestion } from '../../entities/questionnaire-question.entity';
import { QuestionnaireAnswer } from '../../entities/questionnaire-answer.entity';
import { StudentProfile } from '../../entities/student-profile.entity';

interface AnswerMap {
  [questionId: number]: string | string[];
}

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireQuestion)
    private questionsRepo: Repository<QuestionnaireQuestion>,
    @InjectRepository(QuestionnaireAnswer)
    private answersRepo: Repository<QuestionnaireAnswer>,
    @InjectRepository(StudentProfile)
    private profilesRepo: Repository<StudentProfile>,
  ) {}

  async getQuestions() {
    return this.questionsRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async getMyAnswers(userId: number) {
    return this.answersRepo.findOne({ where: { userId } });
  }

  async saveAnswers(userId: number, answers: AnswerMap, completed = false) {
    let record = await this.answersRepo.findOne({ where: { userId } });
    if (!record) {
      record = this.answersRepo.create({ userId });
    }
    record.answers = answers;
    record.completed = completed;
    await this.answersRepo.save(record);

    if (completed) {
      await this.buildProfileFromAnswers(userId, answers);
    }

    return record;
  }

  /**
   * 从问卷答案中提取学生画像标签，写入 student_profiles
   */
  private async buildProfileFromAnswers(userId: number, answers: AnswerMap) {
    const questions = await this.getQuestions();
    const interestTags: string[] = [];
    const skills: string[] = [];
    const goalTags: string[] = [];
    const personalityTags: string[] = [];
    let weeklyHours: number | undefined;

    for (const q of questions) {
      const answer = answers[q.id];
      if (answer === undefined || answer === null) continue;

      if (q.section === 'time') {
        const hourMap: Record<string, number> = { '1': 2, '2': 4, '3': 8, '4': 12 };
        weeklyHours = hourMap[answer as string];
        continue;
      }

      const selectedValues = Array.isArray(answer) ? answer : [answer];
      for (const val of selectedValues) {
        const option = q.options?.find((o) => o.value === val);
        if (!option) continue;

        switch (q.section) {
          case 'interest':
            interestTags.push(...(option.tags ?? []));
            break;
          case 'skill':
            skills.push(...(option.tags ?? []));
            break;
          case 'goal':
            goalTags.push(...(option.tags ?? []));
            break;
          case 'personality':
            personalityTags.push(...(option.tags ?? []));
            break;
        }
      }
    }

    let profile = await this.profilesRepo.findOne({ where: { userId } });
    if (!profile) {
      profile = this.profilesRepo.create({ userId });
    }

    profile.interestTags = [...new Set(interestTags)];
    profile.skills = [...new Set(skills)];
    profile.goalTags = [...new Set(goalTags)];
    profile.personalityTags = [...new Set(personalityTags)];
    profile.weeklyHours = weeklyHours;
    profile.questionnaireDone = true;

    await this.profilesRepo.save(profile);
  }
}
