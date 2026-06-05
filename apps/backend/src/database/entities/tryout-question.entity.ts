import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tryout_questions')
export class TryoutQuestion {
  @PrimaryColumn()
  tryoutId: string;

  @PrimaryColumn()
  questionId: string;

  @Column()
  urutan: number;
}
