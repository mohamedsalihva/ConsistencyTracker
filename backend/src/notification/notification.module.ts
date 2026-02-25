import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Habit, HabitSchema } from 'src/habits/habit.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { NotificationLog, NotificationLogSchema } from './notification-log.schema';
import { notificationService } from './notification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Habit.name, schema: HabitSchema },
      { name: NotificationLog.name, schema: NotificationLogSchema },
    ]),
  ],
  providers: [notificationService],
})
export class NotificationsModule {}
