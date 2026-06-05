import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Question,
  RefreshToken,
  Skill,
  Subject,
  Subscription,
  Transaction,
  Tryout,
  TryoutQuestion,
  User,
  UserAttempt,
  UserSkillMastery,
} from './database/entities';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { SkillsModule } from './modules/skills/skills.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TryoutsModule } from './modules/tryouts/tryouts.module';
import { AttemptsModule } from './modules/attempts/attempts.module';
import { CatModule } from './modules/cat/cat.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ParentModule } from './modules/parent/parent.module';
import { AiModule } from './modules/ai/ai.module';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Subject, Skill, Question, Tryout, TryoutQuestion, UserAttempt, UserSkillMastery, Subscription, Transaction, RefreshToken],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    SkillsModule,
    QuestionsModule,
    TryoutsModule,
    AttemptsModule,
    CatModule,
    SubscriptionsModule,
    PaymentsModule,
    DashboardModule,
    ParentModule,
    AiModule,
  ],
})
export class AppModule {}
