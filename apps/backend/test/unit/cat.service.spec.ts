import { CatService } from '../../src/modules/cat/cat.service';
import { Question, QuestionType } from '../../src/database/entities';

describe('cat.service.spec', () => {
  const mockRepo = {
    find: jest.fn(),
  };
  const service = new CatService(mockRepo as never);

  beforeEach(() => {
    mockRepo.find.mockReset();
  });

  it('estimates theta from responses', () => {
    const question = {
      id: 'q1',
      skillId: 's1',
      tipe: QuestionType.PG,
      teks: 'soal',
      jawabanBenar: ['A'],
      irtA: 1,
      irtB: 0,
      irtC: 0.2,
      isActive: true,
      createdAt: new Date(),
      skill: {} as never,
      pilihan: null,
      pembahasan: null,
    } satisfies Question;

    const result = service.estimateTheta([{ question, isCorrect: true }]);

    expect(result.theta).toBeGreaterThan(-4);
    expect(result.theta).toBeLessThan(4);
    expect(result.se).toBeGreaterThan(0);
  });

  it('selects highest information question not used', async () => {
    const questions = [
      { id: 'q1', skillId: 's1', irtA: 0.8, irtB: 0, irtC: 0.2, isActive: true },
      { id: 'q2', skillId: 's1', irtA: 1.8, irtB: 0, irtC: 0.2, isActive: true },
    ] as Question[];
    mockRepo.find.mockResolvedValue(questions);

    const selected = await service.selectNextQuestion(0, ['q1'], 's1');

    expect(mockRepo.find).toHaveBeenCalledWith({ where: { skillId: 's1', isActive: true } });
    expect(selected.id).toBe('q2');
  });

  it('applies stopping rule', () => {
    expect(service.shouldStop(0.34, 3, 40)).toBe(true);
    expect(service.shouldStop(0.5, 40, 40)).toBe(true);
    expect(service.shouldStop(0.5, 10, 40)).toBe(false);
  });
});
