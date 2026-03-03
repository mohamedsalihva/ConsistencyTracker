import { IsEnum,IsOptional,IsString } from "class-validator";

export class  GoogleCompleteDto {
      @IsEnum(['manager','member'])
      role: 'manager' | 'member';

      @IsOptional()
      @IsString()
      onboardingToken?: string;

      @IsOptional()
      @IsString()
      workspaceName?: string;

      @IsOptional()
      @IsString()
      inviteCode?: string;
}


