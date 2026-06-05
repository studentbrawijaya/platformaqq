import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ unique: true })
  orderId: string;

  @Column('decimal', { precision: 12, scale: 2 })
  jumlah: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ nullable: true })
  paymentMethod: string | null;

  @Column({ nullable: true })
  midtransToken: string | null;

  @Column({ nullable: true })
  midtransRedirectUrl: string | null;

  @Column({ nullable: true })
  paidAt: Date | null;

  @Column({ nullable: true })
  expiredAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
