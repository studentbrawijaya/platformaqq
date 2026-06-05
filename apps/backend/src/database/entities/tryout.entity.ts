import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TryoutJenis {
  SNBT = 'SNBT',
  SKD = 'SKD',
  CAMPURAN = 'CAMPURAN',
}

export enum TryoutMode {
  FIXED = 'FIXED',
  ADAPTIVE = 'ADAPTIVE',
}

@Entity('tryouts')
export class Tryout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  judul: string;

  @Column({ type: 'enum', enum: TryoutJenis })
  jenis: TryoutJenis;

  @Column({ type: 'enum', enum: TryoutMode })
  mode: TryoutMode;

  @Column()
  durasiMenit: number;

  @Column({ nullable: true })
  tanggalMulai: Date;

  @Column({ nullable: true })
  tanggalSelesai: Date;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: 0 })
  maxPeserta: number;
}
