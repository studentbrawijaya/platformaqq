import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../../database/entities';
import { CatService } from './cat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [CatService],
  exports: [CatService],
})
export class CatModule {}
