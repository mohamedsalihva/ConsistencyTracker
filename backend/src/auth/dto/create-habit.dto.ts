import { IsString,MinLength } from "class-validator";

export class CreateHabitDto {
  @IsString()
  @MinLength(1)
  title: string;
}