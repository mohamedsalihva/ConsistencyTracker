import { IsNotEmpty,IsString,MinLength } from "class-validator";

export class updateHabitDto{
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    title: string;
}