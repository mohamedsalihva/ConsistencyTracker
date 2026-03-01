import { Controller, Get,Req,UseGuards,NotFoundException, Post, Body, Delete, Param } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { WorkspacesService } from "./workspaces.services";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";

@Controller("workspace")
export class workspaceController {
    constructor(
       private readonly userService: UsersService,
       private readonly workspaceService: WorkspacesService
    ) {}

    @UseGuards(AuthGuard("jwt"))
    @Get("my-invite")
    async myInvite(@Req() req: any){
        const user = await this.userService.findById(req.user.id);
        if(!user?.workspaceId) throw new NotFoundException("workspace not found");

        const workspace = await this.workspaceService.findById(user.workspaceId);
        if(!workspace) throw new NotFoundException("workspace not found");
        return{
            workspaceName: workspace.name,
            inviteCode:workspace.inviteCode,
        }
    }

    @Get("overview")
    overview(@Req() req:any){
        return this.workspaceService.getworkspaceOverview(req.user.id);
    }

    @Get("members")
    members(@Req()  req:any){
        return this.workspaceService.getWorkspaceMembers(req.user.id);
    }

    @Post("join")
    join(@Req() req:any, @Body() dto: JoinWorkspaceDto){
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