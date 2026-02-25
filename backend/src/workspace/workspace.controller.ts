import { Controller, Get,Req,UseGuards,NotFoundException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { WorkspacesService } from "./workspaces.services";

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
}