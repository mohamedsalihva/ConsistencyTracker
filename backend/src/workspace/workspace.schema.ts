import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true})
export class Workspace {
    @Prop({required: true})
    name: string;

    @Prop ({type: mongoose.Schema.Types.ObjectId, ref:'User', required: true})
    ownerId: string;

    @Prop({required:true,unique:true})
    inviteCode: string;

    @Prop({default:'Manager'})
    managerLabel: string;

    @Prop({default: 'Member'})
    memberLabel: string;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);