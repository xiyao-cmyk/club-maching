import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { Club } from './club.entity';
import { RecruitmentBatch } from './recruitment-batch.entity';

export type ConfigStatus = 'draft' | 'published' | 'closed';

@Entity('club_recruitment_configs')
export class ClubRecruitmentConfig {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'club_id', type: 'int' })
  clubId: number;

  @Column({ name: 'batch_id', type: 'int' })
  batchId: number;

  @Column({ type: 'int', nullable: true })
  quota: number;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ name: 'skill_requirements', type: 'json', nullable: true })
  skillRequirements: string[];

  @Column({ name: 'accept_beginner', default: true })
  acceptBeginner: boolean;

  @Column({ name: 'assessment_intensity', type: 'int', default: 2 })
  assessmentIntensity: number;

  @Column({ name: 'has_interview', default: true })
  hasInterview: boolean;

  @Column({ name: 'custom_questions', type: 'json', nullable: true })
  customQuestions: any[];

  @Column({ type: 'text', default: 'draft' })
  status: ConfigStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @ManyToOne(() => RecruitmentBatch)
  @JoinColumn({ name: 'batch_id' })
  batch: RecruitmentBatch;
}



