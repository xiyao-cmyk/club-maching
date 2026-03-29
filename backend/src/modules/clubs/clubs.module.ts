import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubsService } from './clubs.service';
import { ClubsController } from './clubs.controller';
import { FavoritesController } from './favorites.controller';
import { Club } from '../../entities/club.entity';
import { ClubTag } from '../../entities/club-tag.entity';
import { ClubCategory } from '../../entities/club-category.entity';
import { ClubRecruitmentConfig } from '../../entities/club-recruitment-config.entity';
import { BehaviorEvent } from '../../entities/behavior-event.entity';
import { Favorite } from '../../entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, ClubTag, ClubCategory, ClubRecruitmentConfig, BehaviorEvent, Favorite]),
  ],
  providers: [ClubsService],
  controllers: [ClubsController, FavoritesController],
  exports: [ClubsService],
})
export class ClubsModule {}
