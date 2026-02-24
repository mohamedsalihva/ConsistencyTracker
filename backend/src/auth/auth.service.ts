import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { WorkspacesService } from 'src/workspace/workspaces.services';

@Injectable()
export class AuthService {

  constructor(
    private userService: UsersService,
    private workspaceService: WorkspacesService,
  ) {}

  private toSafeUser(user: any) {
    const obj = typeof user?.toObject === 'function' ? user.toObject() : user;
    const { password, ...safeUser } = obj;
    return safeUser;
  }



  async register(

    name: string,
    email: string,
    password: string,
    accountType: 'manager' | 'member',
    workspaceName?: string,
    inviteCode?: string,

  ) {

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new BadRequestException('User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    if (accountType === 'manager') {
      if (!workspaceName?.trim()) {
        throw new BadRequestException(
          'workspaceName is required for manager signup',
        );
      }

      const manager = await this.userService.create({
        name,
        email,
        password: hashedPassword,
        role: 'manager',
        subscriptionStatus: 'pending',
      });


      const workspace = await this.workspaceService.createWorkspace(
        workspaceName,
        manager._id.toString(),
      );


      const updatedManager = await this.userService.updateById(
        manager._id.toString(),

        {
          workspaceId: workspace._id,
        },
      );

      return { user: this.toSafeUser(updatedManager), workspace };
    }

    if (!inviteCode?.trim()) {
      throw new BadRequestException('inviteCode is required for member signup');
    }

    const workspace = await this.workspaceService.findByInviteCode(inviteCode);
    if (!workspace) throw new BadRequestException('Invalid invite code');

    const member = await this.userService.create({
      name,
      email,
      password: hashedPassword,
      role: 'member',
      subscriptionStatus: 'none',
      workspaceId: workspace._id,
      managerId: workspace.ownerId,
    });


    return { user: this.toSafeUser(member), workspace };
  }


  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    return { user: this.toSafeUser(user), token };
  }

  async me(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('invalid token');
    return this.toSafeUser(user);
  }
  
}
