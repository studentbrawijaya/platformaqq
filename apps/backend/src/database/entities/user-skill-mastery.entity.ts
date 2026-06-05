import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_skill_masteries')
export class UserSkillMastery {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  skillId: string;

  @Column('float', { default: 0.0 })
  theta: number;

  @Column('float', { default: 1.0 })
  thetaSE: number;

  @Column({ default: 0 })
  totalAttempts: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
