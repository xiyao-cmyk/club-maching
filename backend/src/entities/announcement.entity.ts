import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 256 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true, length: 512 })
  cover: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}



