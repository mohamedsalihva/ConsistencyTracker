import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Workspace, WorkspaceSchema } from "./workspace.schema";
import { WorkspacesService } from "./workspaces.services";
import { UsersModule } from "src/users/users.module";
import { workspaceController } from "./workspace.controller";

@Module({
    imports: [MongooseModule.forFeature([{name: Workspace.name, schema: WorkspaceSchema}]),
    UsersModule,
],
    controllers: [workspaceController],
    providers: [WorkspacesService],
    exports: [WorkspacesService],
})

export class WorkspaceModule {}