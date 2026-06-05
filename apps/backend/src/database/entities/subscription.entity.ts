import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PaketSubscription {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ULTIMATE = 'ULTIMATE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: PaketSubscription })
  paket: PaketSubscription;

  @Column()
  mulai: Date;

  @Column()
  akhir: Date;

  @Column({ type: 'enum', enum: SubscriptionStatus })
  status: SubscriptionStatus;
}
