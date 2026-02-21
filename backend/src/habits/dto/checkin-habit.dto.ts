import { IsBoolean, IsNotEmpty, IsString, Matches } from "class-validator";

export class CheckinHabitDto{
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' })
    date: string;

    @IsBoolean()
    completed: boolean;
}