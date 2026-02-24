import { Controller,Post,Body,Res,Get,Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('register')
    register(@Body() dto:RegisterDto){
        const {name,email,password, accountType,workspaceName,inviteCode} = dto;
        return this.authService.register(name,email,password,accountType,workspaceName,inviteCode);
    }

    @Post('login')
    async login(@Body() dto:LoginDto, @Res({passthrough:true}) res:any){
        const {email,password} = dto;
        const data = await this.authService.login(email,password);

        res.cookie('token', data.token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
             maxAge: 7 * 24 * 60 * 60 * 1000,
});

    return { success: true, user: data.user };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: any){
    const user = await this.authService.me(req.user.id);
    return {user};
  }

  @Post('logout')
  logout(@Res({passthrough: true}) res: any){
    res.clearCookie('token',{
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
    });
    return {success: true};
  }

}
