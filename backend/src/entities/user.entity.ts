import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToOne
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { StudentProfile } from './student-profile.entity';

export type UserRole = 'student' | 'club_admin' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 128, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 256 })
  password: string;

  @Column({ length: 64 })
  name: string;

  @Column({ nullable: true, length: 512 })
  avatar: string;

  @Column({ type: 'text', default: 'student' })
  role: UserRole;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => StudentProfile, (sp) => sp.user)
  studentProfile: StudentProfile;
}



