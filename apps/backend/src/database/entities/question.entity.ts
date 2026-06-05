import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Skill } from './skill.entity';

export enum QuestionType {
  PG = 'PG',
  PG_KOMPLEKS = 'PG_KOMPLEKS',
  MENJODOHKAN = 'MENJODOHKAN',
  ISIAN = 'ISIAN',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Skill)
  skill: Skill;

  @Column()
  skillId: string;

  @Column({ type: 'enum', enum: QuestionType })
  tipe: QuestionType;

  @Column('text')
  teks: string;

  @Column('jsonb', { nullable: true })
  pilihan: { key: string; teks: string }[] | null;

  @Column('simple-array')
  jawabanBenar: string[];

  @Column('text', { nullable: true })
  pembahasan: string | null;

  @Column('float', { default: 1.0 })
  irtA: number;

  @Column('float', { default: 0.0 })
  irtB: number;

  @Column('float', { default: 0.25 })
  irtC: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
