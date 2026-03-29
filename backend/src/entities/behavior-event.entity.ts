import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn
} from 'typeorm';
import { User } from './user.entity';
import { Club } from './club.entity';

export type EventType = 'view' | 'favorite' | 'unfavorite' | 'apply' | 'cancel_apply' | 'dwell';

@Entity('behavior_events')
export class BehaviorEvent {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'club_id', type: 'int' })
  clubId: number;

  @Column({
    name: 'event_type',
    type: 'enum',
    enum: ['view', 'favorite', 'unfavorite', 'apply', 'cancel_apply', 'dwell'],
  })
  eventType: EventType;

  @Column({ name: 'duration_ms', type: 'int', nullable: true })
  durationMs: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Club)
  @JoinColumn({ name: 'club_id' })
  club: Club;
}



