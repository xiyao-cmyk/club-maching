import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, OneToOne
} from 'typeorm';
import { User } from './user.entity';
import { Club } from './club.entity';
import { RecruitmentBatch } from './recruitment-batch.entity';
import { Interview } from './interview.entity';

export type ApplicationStatus =
  | 'pending'
  | 'reviewing'
  | 'interview'
  | 'admitted'
  | 'rejected'
  | 'withdrawn';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'club_id', type: 'int' })
  clubId: number;

  @Column({ name: 'batch_id', type: 'int' })
  batchId: number;

  @Column({ type: 'int', default: 1 })
  priority: number;

  @Column({ type: 'text', nullable: true })
  motivation: string;

  @Column({ name: 'custom_answers', type: 'json', nullable: true })
  customAnswers: any;

  @Column({
    type: 'enum',
    enum: ['pending', 'reviewing', 'interview', 'admitted', 'rejected', 'withdrawn'],
    default: 'pending',
  })
  status: ApplicationStatus;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ type: 'text', nullable: true })
  remark: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'club_id' })
  club: Club;

  @ManyToOne(() => RecruitmentBatch)
  @JoinColumn({ name: 'batch_id' })
  batch: RecruitmentBatch;

  @OneToOne(() => Interview, (i) => i.application)
  interview: Interview;
}



