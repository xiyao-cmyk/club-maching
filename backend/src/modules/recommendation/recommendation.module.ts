import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationService } from './recommendation.service';
import { RecommendationController } from './recommendation.controller';
import { Club } from '../../entities/club.entity';
import { ClubRecruitmentConfig } from '../../entities/club-recruitment-config.entity';
import { StudentProfile } from '../../entities/student-profile.entity';
import { BehaviorEvent } from '../../entities/behavior-event.entity';
import { Announcement } from '../../entities/announcement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, ClubRecruitmentConfig, StudentProfile, BehaviorEvent, Announcement]),
  ],
  providers: [RecommendationService],
  controllers: [RecommendationController],
  exports: [RecommendationService],
})
export class RecommendationModule {}
