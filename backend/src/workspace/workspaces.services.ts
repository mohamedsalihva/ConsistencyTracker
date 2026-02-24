import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Workspace } from './workspace.schema';

@Injectable()
export class WorkspacesService {
  constructor(@InjectModel(Workspace.name) private workspaceModel: Model<Workspace>) {}

  private generateInviteCode() {
    return `JOIN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }

  async createWorkspace(name: string, ownerId: string) {
    let inviteCode = this.generateInviteCode();
    while (await this.workspaceModel.findOne({ inviteCode })) {
      inviteCode = this.generateInviteCode();
    }

    return this.workspaceModel.create({
      name: name.trim(),
      ownerId,
      inviteCode,
    });
  }

  findByInviteCode(inviteCode: string) {
    return this.workspaceModel.findOne({ inviteCode: inviteCode.trim().toUpperCase() });
  }

  findById(id: string) {
    return this.workspaceModel.findById(id);
  }
}
