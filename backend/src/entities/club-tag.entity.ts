import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Club } from './club.entity';

export type TagType = 'interest' | 'skill' | 'requirement' | 'goal';

@Entity('club_tags')
export class ClubTag {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ name: 'club_id', type: 'int' })
  clubId: number;

  @Column({ length: 32 })
  tag: string;

  @Column({ name: 'tag_type', type: 'text', default: 'interest' })
  tagType: TagType;

  @ManyToOne(() => Club, (club) => club.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'club_id' })
  club: Club;
}



