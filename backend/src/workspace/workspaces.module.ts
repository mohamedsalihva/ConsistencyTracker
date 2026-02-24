import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Workspace, WorkspaceSchema } from "./workspace.schema";
import { WorkspacesService } from "./workspaces.services";

@Module({
    imports: [MongooseModule.forFeature([{name: Workspace.name, schema: WorkspaceSchema}])],
    providers: [WorkspacesService],
    exports: [WorkspacesService],
})

export class WorkspaceModule {}