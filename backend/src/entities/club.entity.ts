import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, ManyToOne, JoinColumn
} from 'typeorm';
import { ClubTag } from './club-tag.entity';
import { ClubCategory } from './club-category.entity';

export type ClubStatus = 'pending' | 'active' | 'inactive';

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 128 })
  name: string;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number;

  @Column({ nullable: true, length: 512 })
  logo: string;

  @Column({ nullable: true, length: 512 })
  cover: string;

  @Column({ nullable: true, length: 256 })
  slogan: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'founded_year', type: 'int', nullable: true })
  foundedYear: number;

  @Column({ name: 'member_count', type: 'int', default: 0 })
  memberCount: number;

  @Column({ name: 'activity_frequency', nullable: true, length: 64 })
  activityFrequency: string;

  @Column({ name: 'contact_email', nullable: true, length: 128 })
  contactEmail: string;

  @Column({ name: 'contact_qq', nullable: true, length: 32 })
  contactQq: string;

  @Column({ type: 'text', default: 'pending' })
  status: ClubStatus;

  @Column({ name: 'admin_user_id', type: 'int', nullable: true })
  adminUserId: number;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ClubTag, (tag) => tag.club, { eager: true })
  tags: ClubTag[];

  @ManyToOne(() => ClubCategory, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: ClubCategory;
}



