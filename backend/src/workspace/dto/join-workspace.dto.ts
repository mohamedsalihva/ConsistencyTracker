import { IsString, Matches } from "class-validator";

export class JoinWorkspaceDto {
  @IsString()
  @Matches(/^JOIN-[A-Z0-9]{6}$/, {
    message: "inviteCode must be in format JOIN-ABC123",
  })
  inviteCode: string;
}
