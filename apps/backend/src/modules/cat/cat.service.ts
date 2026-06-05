import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../../database/entities';

interface CatResponse {
  question: Question;
  isCorrect: boolean;
}

@Injectable()
export class CatService {
  constructor(@InjectRepository(Question) private readonly questionRepository: Repository<Question>) {}

  estimateTheta(responses: CatResponse[]): { theta: number; se: number } {
    if (responses.length === 0) {
      return { theta: 0, se: 1 };
    }

    const points = this.generateQuadraturePoints(-4, 4, 41);
    let numerator = 0;
    let denominator = 0;

    for (const theta of points) {
      const prior = Math.exp(-0.5 * theta * theta);
      const likelihood = responses.reduce((acc, item) => {
        const p = this.calculateProbability(theta, item.question.irtA, item.question.irtB, item.question.irtC);
        return acc * (item.isCorrect ? p : 1 - p);
      }, 1);
      const posterior = prior * likelihood;
      numerator += theta * posterior;
      denominator += posterior;
    }

    const theta = denominator === 0 ? 0 : numerator / denominator;
    const info = responses.reduce((sum, item) => sum + this.calculateFisherInformation(theta, item.question), 0);
    const se = info > 0 ? Math.sqrt(1 / info) : 1;
    return { theta, se };
  }

  calculateProbability(theta: number, a: number, b: number, c: number): number {
    const logistic = 1 / (1 + Math.exp(-1.702 * a * (theta - b)));
    return c + (1 - c) * logistic;
  }

  async selectNextQuestion(theta: number, usedQuestionIds: string[], skillId: string): Promise<Question> {
    const candidates = await this.questionRepository.find({
      where: { skillId, isActive: true },
    });

    const filtered = candidates.filter((q) => !usedQuestionIds.includes(q.id));
    const pool = filtered.length > 0 ? filtered : candidates;
    const sorted = pool.sort(
      (a, b) => this.calculateFisherInformation(theta, b) - this.calculateFisherInformation(theta, a),
    );
    if (sorted.length === 0) {
      throw new Error('No active question available');
    }
    return sorted[0];
  }

  calculateFisherInformation(theta: number, question: Question): number {
    const p = this.calculateProbability(theta, question.irtA, question.irtB, question.irtC);
    const q = 1 - p;
    const c = question.irtC;
    const numerator = (1.702 * question.irtA) ** 2 * ((p - c) ** 2) * q;
    const denominator = ((1 - c) ** 2) * p;
    return denominator === 0 ? 0 : numerator / denominator;
  }

  shouldStop(se: number, itemCount: number, maxItems: number): boolean {
    return se < 0.35 || itemCount >= maxItems;
  }

  private generateQuadraturePoints(min: number, max: number, count: number): number[] {
    const step = (max - min) / (count - 1);
    return Array.from({ length: count }, (_, index) => min + step * index);
  }
}
