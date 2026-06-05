import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_attempts')
export class UserAttempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  questionId: string;

  @Column({ nullable: true })
  tryoutId: string | null;

  @Column({ nullable: true })
  sessionId: string | null;

  @Column('simple-array', { nullable: true })
  jawabanDipilih: string[] | null;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ nullable: true })
  skorPartial: number | null;

  @Column({ nullable: true })
  waktuPengerjaanDetik: number | null;

  @CreateDateColumn()
  createdAt: Date;
}
