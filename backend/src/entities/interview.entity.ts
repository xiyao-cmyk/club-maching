import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn
} from 'typeorm';
import { Application } from './application.entity';

@Entity('interviews')
export class Interview {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'application_id', type: 'int', unique: true })
  applicationId: number;

  @Column({ name: 'interview_time', type: 'timestamp' })
  interviewTime: Date;

  @Column({ nullable: true, length: 256 })
  location: string;

  @Column({ name: 'online_link', nullable: true, length: 512 })
  onlineLink: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', default: 'pending' })
  result: 'pending' | 'pass' | 'fail';

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Application, (a) => a.interview)
  @JoinColumn({ name: 'application_id' })
  application: Application;
}



