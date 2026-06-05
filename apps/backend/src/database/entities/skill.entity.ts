import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Subject)
  subject: Subject;

  @Column()
  subjectId: string;

  @Column()
  nama: string;
}
