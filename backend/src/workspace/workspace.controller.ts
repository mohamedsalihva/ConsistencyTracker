import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WorkspacesService } from "./workspaces.services";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";

@Controller("workspace")
@UseGuards(AuthGuard("jwt"))
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspacesService) {}

  @Get("my-invite")
  async myInvite(@Req() req: any) {
    const overview = await this.workspaceService.getWorkspaceOverview(req.user.id);
    return {
      workspaceName: overview.workspaceName,
      inviteCode: overview.inviteCode,
    };
  }

  @Get("overview")
  overview(@Req() req: any) {
    return this.workspaceService.getWorkspaceOverview(req.user.id);
  }

  @Get("members")
  members(@Req() req: any) {
    return this.workspaceService.getWorkspaceMembers(req.user.id);
  }

  @Post("join")
  join(@Req() req: any, @Body() dto: JoinWorkspaceDto) {
    return this.workspaceService.joinWorkspace(req.user.id, dto.inviteCode);
  }

  @Post("regenerate-invite")
  regenerateInvite(@Req() req: any) {
    return this.workspaceService.regenerateInviteCode(req.user.id);
  }

  @Delete("members/:memberId")
  removeMember(@Req() req: any, @Param("memberId") memberId: string) {
    return this.workspaceService.removeMember(req.user.id, memberId);
  }
}
