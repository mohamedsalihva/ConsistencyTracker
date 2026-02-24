import { IsEmail,IsString, MinLength,IsIn, IsOptional } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
    
    @IsIn(['manager','member'])
    accountType: 'manager' | 'member';

    @IsOptional()
    @IsString()
    workspaceName?: string;

    @IsOptional()
    @IsString()
    inviteCode?:string;
}