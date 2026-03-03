import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleCompleteDto } from './dto/googleComplete.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private getCookieOptions(maxAge?: number) {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
      secure: isProd,
      ...(maxAge ? { maxAge } : {}),
    };
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    const { name, email, password, accountType, workspaceName, inviteCode } =
      dto;
    return this.authService.register(
      name,
      email,
      password,
      accountType,
      workspaceName,
      inviteCode,
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const { email, password } = dto;
    const data = await this.authService.login(email, password);

    res.cookie('token', data.token, this.getCookieOptions(7 * 24 * 60 * 60 * 1000));

    return { success: true, user: data.user, token: data.token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.authService.me(req.user.id);
    return { user };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('token', this.getCookieOptions());
    return { success: true };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const result = await this.authService.handleGoogleCallback(req.user);
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (result.type === 'login') {
      res.cookie('token', result.token, this.getCookieOptions(7 * 24 * 60 * 60 * 1000));
      const needsBilling =
        result.user?.role === 'manager' &&
        result.user?.subscriptionStatus !== 'active';
      const params = new URLSearchParams({
        token: result.token,
        next: needsBilling ? '/billing' : '/dashboard',
      });
      return res.redirect(`${frontend}/auth/google-finalize?${params.toString()}`);
    }

    res.clearCookie('token', this.getCookieOptions());
    res.cookie('google_onboarding', result.onboardingToken, this.getCookieOptions(15 * 60 * 1000));
    return res.redirect(`${frontend}/auth/google-complete`);
  }

  @Post('google/complete')
  async googleComplete(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
    @Body() dto: GoogleCompleteDto,
  ) {
    const onboardingToken = req.cookies?.google_onboarding;
    if (!onboardingToken)
      throw new BadRequestException('Google onboarding session expired');

    const data = await this.authService.completeGoogleSignup(
      onboardingToken,
      dto,
    );

    res.clearCookie('google_onboarding', this.getCookieOptions());
    res.cookie('token', data.token, this.getCookieOptions(7 * 24 * 60 * 60 * 1000));

    return { success: true, user: data.user, token: data.token };
  }
}


