import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<{ user: unknown }> {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const userAgent = Array.isArray(request.headers['user-agent'])
      ? request.headers['user-agent'][0]
      : request.headers['user-agent'];
    const result = await this.authService.login(dto, userAgent);
    response.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return { accessToken: result.accessToken };
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto, @Req() request: Request): Promise<{ accessToken: string }> {
    const tokenFromCookie = request.cookies?.refresh_token as string | undefined;
    const token = dto.refreshToken ?? tokenFromCookie ?? '';
    return this.authService.refresh(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Body() dto: RefreshDto, @Req() request: Request): Promise<{ message: string }> {
    const tokenFromCookie = request.cookies?.refresh_token as string | undefined;
    const token = dto.refreshToken ?? tokenFromCookie ?? '';
    await this.authService.logout(token);
    return { message: 'Logged out' };
  }

  @Post('forgot-password')
  forgotPassword(): { message: string } {
    return { message: 'TODO: implement' };
  }

  @Post('reset-password')
  resetPassword(): { message: string } {
    return { message: 'TODO: implement' };
  }
}
