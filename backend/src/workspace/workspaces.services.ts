import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/users/users.schema";
import { Workspace } from "./workspace.schema";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  private generateInviteCode() {
    return `JOIN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }

  private async generateUniqueInviteCode() {
    let inviteCode = this.generateInviteCode();
    while (await this.workspaceModel.findOne({ inviteCode })) {
      inviteCode = this.generateInviteCode();
    }
    return inviteCode;
  }

  private toSafeUser(user: any) {
    const obj = typeof user?.toObject === "function" ? user.toObject() : user;
    if (!obj) return obj;
    const { password, ...safe } = obj;
    return safe;
  }

  async createWorkspace(name: string, ownerId: string) {
    const inviteCode = await this.generateUniqueInviteCode();
    return this.workspaceModel.create({
      name: name.trim(),
      ownerId,
      inviteCode,
    });
  }

  findByInviteCode(inviteCode: string) {
    return this.workspaceModel.findOne({
      inviteCode: inviteCode.trim().toUpperCase(),
    });
  }

  findById(id: string) {
    return this.workspaceModel.findById(id);
  }

  async getWorkspaceOverview(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");
    if (!user.workspaceId) throw new NotFoundException("Workspace not found");

    const workspace = await this.workspaceModel.findById(user.workspaceId);
    if (!workspace) throw new NotFoundException("Workspace not found");

    const memberCount = await this.userModel.countDocuments({
      role: "member",
      workspaceId: workspace._id.toString(),
      managerId: workspace.ownerId.toString(),
    });

    return {
      workspaceId: workspace._id,
      workspaceName: workspace.name,
      inviteCode: workspace.inviteCode,
      memberCount,
      ownerId: workspace.ownerId,
    };
  }
  async getWorkspaceMembers(managerId: string) {
    const manager = await this.userModel.findById(managerId);

    if (!manager) throw new NotFoundException("User not found");
    if (manager.role !== "manager") {
      throw new ForbiddenException("Only manager can access members");
    }
    if (!manager.workspaceId) {
      throw new NotFoundException("Workspace not found");
    }

    const members = await this.userModel
      .find({
        role: "member",
        workspaceId: manager.workspaceId.toString(),
        managerId: manager._id.toString(),
      })
      .select("_id name email createdAt")
      .sort({ createdAt: -1 });

    return members;
  }
  async joinWorkspace(memberId: string, inviteCode: string) {
    const member = await this.userModel.findById(memberId);

    if (!member) throw new NotFoundException("User not found");
    if (member.role !== "member") {
      throw new ForbiddenException("Only members can join via invite");
    }
    const workspace = await this.findByInviteCode(inviteCode);
    if (!workspace) throw new BadRequestException("Invalid invite code");

    const alreadyInSameWorkspace =
      member.workspaceId?.toString() === workspace._id.toString();
    if (alreadyInSameWorkspace) {
      throw new BadRequestException("You are already in this workspace");
    }

    const updated = await this.userModel.findByIdAndUpdate(
      memberId,
      {
        workspaceId: workspace._id,
        managerId: workspace.ownerId,
      },
      { new: true },
    );
    return {
      user: this.toSafeUser(updated),
      workspace: {
        id: workspace._id,
        name: workspace.name,
        inviteCode: workspace.inviteCode,
      },

    };
  }

  async regenerateInviteCode(managerId: string) {
    const manager = await this.userModel.findById(managerId);
    if (!manager) throw new NotFoundException("User not found");
    if (manager.role !== "manager") {
      throw new ForbiddenException("Only manager can regenerate invite");
    }
    if (!manager.workspaceId) {
      throw new NotFoundException("Workspace not found");
    }
  
    const inviteCode = await this.generateUniqueInviteCode();

    const workspace = await this.workspaceModel.findByIdAndUpdate(
      manager.workspaceId,
      { inviteCode },
      { new: true },
    );

    if (!workspace) throw new NotFoundException("Workspace not found");

    return {
      workspaceId: workspace._id,
      workspaceName: workspace.name,
      inviteCode: workspace.inviteCode,
    };
  }

  async removeMember(managerId: string, memberId: string) {
    if (!Types.ObjectId.isValid(memberId)) {
      throw new BadRequestException("Invalid member id");
    }

    const manager = await this.userModel.findById(managerId);
    if (!manager) throw new NotFoundException("User not found");
    if (manager.role !== "manager") {
      throw new ForbiddenException("Only manager can remove members");
    }
    if (!manager.workspaceId) {
      throw new NotFoundException("Workspace not found");
    }

    const member = await this.userModel.findById(memberId);
    if (!member) throw new NotFoundException("Member not found");
    if (member.role !== "member") {
      throw new BadRequestException("Target user is not a member");
    }

    const belongsToManager =
      member.managerId?.toString() === manager._id.toString() &&
      member.workspaceId?.toString() === manager.workspaceId.toString();

    if (!belongsToManager) {
      throw new ForbiddenException("Member does not belong to your workspace");
    }

    await this.userModel.findByIdAndUpdate(memberId, {
      workspaceId: null,
      managerId: null,
    });
    return { success: true };
  }
}
