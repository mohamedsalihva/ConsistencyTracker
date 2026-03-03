import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type UserRole = "manager" | "member";
export type SubscriptionStatus = "none" | "pending" | "active" | "failed";
export type AuthProvider = "local" | "google";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: ["manager", "member"], default: "member" })
  role: UserRole;

  @Prop({ type: String, enum: ["none", "pending", "active", "failed"], default: "none" })
  subscriptionStatus: SubscriptionStatus;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "workspace", default: null })
  workspaceId?: string | null;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", default: null })
  managerId?: string | null;

  @Prop({ type: String, default: undefined })
  googleId?: string | null;

  @Prop({ type: String, enum: ["local", "google"], default: "local" })
  authProvider: AuthProvider;

  @Prop({ type: String, default: null })
  avatar?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: { googleId: { $type: "string" } },
  },
);
