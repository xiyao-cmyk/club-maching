import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from '../../entities/application.entity';
import { Interview } from '../../entities/interview.entity';
import { Notification } from '../../entities/notification.entity';
import { Club } from '../../entities/club.entity';
import { RecruitmentBatch } from '../../entities/recruitment-batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Interview, Notification, Club, RecruitmentBatch])],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
