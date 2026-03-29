import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('club_categories')
export class ClubCategory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 64 })
  name: string;

  @Column({ nullable: true, length: 64 })
  icon: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}



