import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UsersService } from 'src/users/users.service';
import { WorkspacesService } from 'src/workspace/workspaces.services';
import { GoogleCompleteDto } from './dto/googleComplete.dto';

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

  private signAppToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
  }

  private signGoogleOnboardingToken(payload: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string | null;
  }) {
    return jwt.sign(payload, process.env.GOOGLE_ONBOARDING_SECRET!, {
      expiresIn: '15m',
    });
  }

  private verifyGoogleOnboardingToken(token: string) {
    return jwt.verify(token, process.env.GOOGLE_ONBOARDING_SECRET!) as {
      googleId: string;
      email: string;
      name: string;
      avatar?: string | null;
    };
  }

  async register(
    name: string,
    email: string,
    password: string,
    accountType: 'manager' | 'member',
    workspaceName?: string,
    inviteCode?: string,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await this.userService.findByEmail(normalizedEmail);
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
        email: normalizedEmail,
        password: hashedPassword,
        role: 'manager',
        subscriptionStatus: 'pending',
        authProvider: 'local',
      });

      const workspace = await this.workspaceService.createWorkspace(
        workspaceName,
        manager._id.toString(),
      );

      const updatedManager = await this.userService.updateById(
        manager._id.toString(),
        { workspaceId: workspace._id },
      );

      return { user: this.toSafeUser(updatedManager), workspace };
    }

    let workspace: Awaited<
      ReturnType<WorkspacesService['findByInviteCode']>
    > | null = null;
    let workspaceId: string | null = null;
    let managerId: string | null = null;

    if (inviteCode?.trim()) {
      workspace = await this.workspaceService.findByInviteCode(inviteCode);
      if (!workspace) throw new BadRequestException('Invalid invite code');

      workspaceId = workspace._id.toString();
      managerId = workspace.ownerId.toString();
    }

    const member = await this.userService.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'member',
      subscriptionStatus: 'none',
      workspaceId,
      managerId,
      authProvider: 'local',
    });

    return { user: this.toSafeUser(member), workspace };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userService.findByEmail(normalizedEmail);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.authProvider === 'google') {
      throw new UnauthorizedException('This account uses Google sign-in');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.signAppToken(user._id.toString());
    return { user: this.toSafeUser(user), token };
  }

  async me(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('invalid token');
    return this.toSafeUser(user);
  }

  async handleGoogleCallback(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string | null;
  }) {
    let user = await this.userService.findByEmail(googleUser.email);

    if (user && !user.googleId) {
      user = await this.userService.updateById(user._id.toString(), {
        googleId: googleUser.googleId,
        authProvider: 'google',
        avatar: googleUser.avatar ?? null,
      });
    }

    if (user?.googleId === googleUser.googleId || user?.email === googleUser.email) {
      const safeUser = this.toSafeUser(user);
      if (safeUser.role) {
        return {
          type: 'login' as const,
          token: this.signAppToken(user._id.toString()),
          user: safeUser,
        };
      }
    }

    const onboardingToken = this.signGoogleOnboardingToken({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.avatar ?? null,
    });

    return { type: 'onboarding' as const, onboardingToken };
  }

  async completeGoogleSignup(onboardingToken: string, dto: GoogleCompleteDto) {
    const payload = this.verifyGoogleOnboardingToken(onboardingToken);

    const email = payload.email;
    const name = payload.name;
    const googleId = payload.googleId;
    const avatar = payload.avatar ?? null;

    let user = await this.userService.findByEmail(email);
    const randomPassword = crypto.randomBytes(24).toString('hex');
    const randomPasswordHash = await bcrypt.hash(randomPassword, 10);

    if (dto.role === 'manager') {
      if (!dto.workspaceName?.trim()) {
        throw new BadRequestException('workspaceName is required');
      }

      if (!user) {
        user = await this.userService.create({
          name,
          email,
          password: randomPasswordHash,
          role: 'manager',
          subscriptionStatus: 'pending',
          googleId,
          authProvider: 'google',
          avatar,
        });
      } else {
        user = await this.userService.updateById(user._id.toString(), {
          role: 'manager',
          subscriptionStatus: user.subscriptionStatus ?? 'pending',
          googleId,
          authProvider: 'google',
          avatar,
        });
      }

      if (!user) {
        throw new BadRequestException('Unable to complete Google signup');
      }

      if (!user.workspaceId) {
        const workspace = await this.workspaceService.createWorkspace(
          dto.workspaceName,
          user._id.toString(),
        );
        user = await this.userService.updateById(user._id.toString(), {
          workspaceId: workspace._id,
        });
      }
    } else {
      let workspaceId: string | null = null;
      let managerId: string | null = null;

      if (dto.inviteCode?.trim()) {
        const workspace = await this.workspaceService.findByInviteCode(
          dto.inviteCode.trim().toUpperCase(),
        );
        if (!workspace) throw new BadRequestException('Invalid invite code');

        workspaceId = workspace._id.toString();
        managerId = workspace.ownerId.toString();
      }

      if (!user) {
        user = await this.userService.create({
          name,
          email,
          password: randomPasswordHash,
          role: 'member',
          subscriptionStatus: 'none',
          workspaceId,
          managerId,
          googleId,
          authProvider: 'google',
          avatar,
        });
      } else {
        user = await this.userService.updateById(user._id.toString(), {
          role: 'member',
          subscriptionStatus: 'none',
          workspaceId: workspaceId ?? user.workspaceId ?? null,
          managerId: managerId ?? user.managerId ?? null,
          googleId,
          authProvider: 'google',
          avatar,
        });
      }
    }

    if (!user) {
      throw new BadRequestException('Unable to complete Google signup');
    }

    return {
      token: this.signAppToken(user._id.toString()),
      user: this.toSafeUser(user),
    };
  }
}
