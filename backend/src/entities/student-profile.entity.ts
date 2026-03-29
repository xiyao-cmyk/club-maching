import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity('student_profiles')
export class StudentProfile {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'int', unique: true })
  userId: number;

  @Column({ name: 'student_id', nullable: true, length: 32 })
  studentId: string;

  @Column({ nullable: true, length: 128 })
  school: string;

  @Column({ nullable: true, length: 128 })
  faculty: string;

  @Column({ nullable: true, length: 128 })
  major: string;

  @Column({ type: 'int', nullable: true })
  grade: number;

  @Column({ name: 'weekly_hours', type: 'int', nullable: true })
  weeklyHours: number;

  @Column({ type: 'json', nullable: true })
  skills: string[];

  @Column({ name: 'personality_tags', type: 'json', nullable: true })
  personalityTags: string[];

  @Column({ name: 'goal_tags', type: 'json', nullable: true })
  goalTags: string[];

  @Column({ name: 'interest_tags', type: 'json', nullable: true })
  interestTags: string[];

  @Column({ name: 'questionnaire_done', default: false })
  questionnaireDone: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.studentProfile)
  @JoinColumn({ name: 'user_id' })
  user: User;
}



