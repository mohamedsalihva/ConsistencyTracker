import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { WorkspaceModule } from 'src/workspace/workspaces.module';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [UsersModule, WorkspaceModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,GoogleStrategy]
})
export class AuthModule {}
