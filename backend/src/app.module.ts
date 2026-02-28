import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HabitsModule } from './habits/habits.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AiModule } from './ai/ai.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './notification/notification.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NotificationsModule,

    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60, limit: 3 }],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    HabitsModule,
    AuthModule,
    UsersModule,
    AiModule,
    BillingModule,
  ],
})
export class AppModule {}
