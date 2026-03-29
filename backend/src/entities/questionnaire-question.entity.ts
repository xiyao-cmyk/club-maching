import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('questionnaire_questions')
export class QuestionnaireQuestion {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'text' })
  section: 'interest' | 'time' | 'skill' | 'personality' | 'goal';

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ length: 256 })
  question: string;

  @Column({ type: 'text', default: 'single' })
  type: 'single' | 'multi' | 'scale';

  @Column({ type: 'json', nullable: true })
  options: Array<{ value: string; label: string; tags: string[] }>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}



