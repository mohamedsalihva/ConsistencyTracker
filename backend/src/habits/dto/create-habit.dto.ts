import { IsNotEmpty, IsString,MinLength } from "class-validator";

export class CreateHabitDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  title: string;
}