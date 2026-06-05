import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UserRole } from '../../src/database/entities';

describe('auth.service.spec', () => {
  const userRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };
  const refreshTokenRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('access-token'),
  };
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('secret'),
    get: jest.fn().mockReturnValue('15m'),
  };

  const service = new AuthService(
    userRepository as never,
    refreshTokenRepository as never,
    jwtService as never,
    configService as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers user and excludes password hash from response', async () => {
    const created = {
      id: 'u1',
      email: 'a@a.com',
      nama: 'A',
      role: UserRole.STUDENT,
      passwordHash: 'hashed',
      targetJalur: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    userRepository.create.mockReturnValue(created);
    userRepository.save.mockResolvedValue(created);

    const result = await service.register({
      email: 'a@a.com',
      password: 'StrongPass1!',
      nama: 'A',
      role: UserRole.STUDENT,
    });

    expect(result.user).toMatchObject({ email: 'a@a.com' });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('returns tokens on valid login', async () => {
    const passwordHash = await bcrypt.hash('StrongPass1!', 12);
    userRepository.findOne.mockResolvedValue({
      id: 'u1',
      email: 'a@a.com',
      role: UserRole.STUDENT,
      passwordHash,
    });
    refreshTokenRepository.create.mockImplementation((v) => v);
    refreshTokenRepository.save.mockResolvedValue({});

    const result = await service.login({ email: 'a@a.com', password: 'StrongPass1!' });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBeTruthy();
  });

  it('throws on invalid login', async () => {
    userRepository.findOne.mockResolvedValue(null);
    await expect(service.login({ email: 'x@x.com', password: 'StrongPass1!' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('refreshes token when refresh token record is valid', async () => {
    refreshTokenRepository.findOne.mockResolvedValue({
      userId: 'u1',
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
    });
    userRepository.findOne.mockResolvedValue({
      id: 'u1',
      email: 'a@a.com',
      role: UserRole.STUDENT,
    });

    const result = await service.refresh('valid-refresh-token');

    expect(result.accessToken).toBe('access-token');
  });
});
