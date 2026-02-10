import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService){}

    async register(name: string, email: string, password: string){
        const existingUser = await this.userService.findByEmail(email);
        if(existingUser) throw new BadRequestException('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userService.create({name,email,password: hashedPassword});
        return user;
    }

    async login(email:string, password:string){
        const user = await this.userService.findByEmail(email);
        if(!user) throw new UnauthorizedException('Invalid credentials');

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

        const token = jwt.sign(
            {id: user._id,}, 
            process.env.JWT_SECRET!,
             {expiresIn: '7d'},
            );
        return {user, token};
    };
}
