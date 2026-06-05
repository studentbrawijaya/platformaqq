import { randomBytes, createHash } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RefreshToken, User } from '../../database/entities';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ user: Omit<User, 'passwordHash'> }> {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const created = this.userRepository.create({
      email: dto.email,
      nama: dto.nama,
      role: dto.role,
      passwordHash,
      targetJalur: dto.targetJalur ?? null,
      parentId: null,
    });
    const user = await this.userRepository.save(created);
    const { passwordHash: _hidden, ...rest } = user;
    return { user: rest };
  }

  async login(dto: LoginDto, userAgent?: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const accessToken = await this.signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = randomBytes(32).toString('hex');
    const refreshTokenHash = this.hashToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.refreshTokenRepository.save(
      this.refreshTokenRepository.create({
        userId: user.id,
        token: refreshTokenHash,
        expiresAt,
        userAgent: userAgent ?? null,
      }),
    );

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    const tokenHash = this.hashToken(refreshToken);
    const record = await this.refreshTokenRepository.findOne({ where: { token: tokenHash } });
    if (!record || record.revokedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    const user = await this.userRepository.findOne({ where: { id: record.userId } });
    if (!user) {
      throw new UnauthorizedException('User tidak ditemukan');
    }

    const accessToken = await this.signAccessToken({ sub: user.id, email: user.email, role: user.role });
    return { accessToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    await this.refreshTokenRepository.update({ token: tokenHash }, { revokedAt: new Date() });
  }

  private signAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
