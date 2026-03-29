import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Club } from '../../entities/club.entity';
import { User } from '../../entities/user.entity';
import { Application } from '../../entities/application.entity';
import { RecruitmentBatch } from '../../entities/recruitment-batch.entity';
import { Announcement } from '../../entities/announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Club, User, Application, RecruitmentBatch, Announcement])],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
