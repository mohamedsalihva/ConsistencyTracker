import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps:true})
export class NotificationLog {
    @Prop({type: mongoose.Schema.Types.ObjectId, ref: `User`, required: true})
    managerId: string;

    @Prop({required: true})
    dateKey: string;
     
    @Prop({required:true, default: 'incomplete-habits'})
    type: string;
}

export const NotificationLogSchema =SchemaFactory.createForClass(NotificationLog);