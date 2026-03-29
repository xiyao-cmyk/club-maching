import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

export type BatchStatus = 'upcoming' | 'active' | 'ended';

@Entity('recruitment_batches')
export class RecruitmentBatch {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ type: 'text', default: 'upcoming' })
  status: BatchStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}



