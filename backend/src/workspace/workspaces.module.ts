import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Workspace, WorkspaceSchema } from "./workspace.schema";
import { WorkspacesService } from "./workspaces.services";
import { WorkspaceController } from "./workspace.controller";
import { User, UserSchema } from "src/users/users.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspacesService],
  exports: [WorkspacesService],
})
export class WorkspaceModule {}
