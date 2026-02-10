import { Controller,Post,Body,Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService){}

    @Post('register')
    register(@Body() body: any){
        const {name,email,password} = body;
        return this.authService.register(name,email,password);
    }

    @Post('login')
    async login(@Body() body:any, @Res({passthrough:true}) res:any){
        const {email,password} = body;
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