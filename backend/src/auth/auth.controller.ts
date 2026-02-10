import { Controller,Post,Body,Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('register')
    register(@Body() dto:RegisterDto){
        const {name,email,password} = dto;
        return this.authService.register(name,email,password);
    }

    @Post('login')
    async login(@Body() dto:LoginDto, @Res({passthrough:true}) res:any){
        const {email,password} = dto;
        const data = await this.authService.login(email,password);

        res.cookies('token', data.token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
             maxAge: 7 * 24 * 60 * 60 * 1000,
});

    return { success: true, user: data.user };
  }
}