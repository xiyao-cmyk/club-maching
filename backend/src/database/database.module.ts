import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '../entities/user.entity';
import { StudentProfile } from '../entities/student-profile.entity';
import { ClubCategory } from '../entities/club-category.entity';
import { Club } from '../entities/club.entity';
import { ClubTag } from '../entities/club-tag.entity';
import { RecruitmentBatch } from '../entities/recruitment-batch.entity';
import { ClubRecruitmentConfig } from '../entities/club-recruitment-config.entity';
import { QuestionnaireQuestion } from '../entities/questionnaire-question.entity';
import { Announcement } from '../entities/announcement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, StudentProfile, ClubCategory, Club, ClubTag,
      RecruitmentBatch, ClubRecruitmentConfig, QuestionnaireQuestion, Announcement,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class DatabaseModule {}
