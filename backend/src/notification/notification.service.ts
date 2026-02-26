import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { Model } from 'mongoose';
import nodemailer from 'nodemailer';
import { User } from 'src/users/users.schema';
import { Habit } from 'src/habits/habit.schema';
import { NotificationLog } from './notification-log.schema';

type MemberAlert = {
  memberName: string;
  incompleteCount: number;
  totalHabits: number;
};

@Injectable()
export class notificationService {
  private readonly logger = new Logger(notificationService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    @InjectModel(NotificationLog.name) private logModel: Model<NotificationLog>,
  ) {}

  private dayKey(date = new Date()) {
    return date.toISOString().split('T')[0];
  }

  private async sendMail(to: string, subject: string, text: string) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;

    if (!host || !user || !pass || !from) {
      this.logger.warn('SMTP env missing. skipping email send');
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({ from, to, subject, text });
  }

  @Cron(process.env.MANAGER_NOTIFY_CRON || '0 21 * * *')
  
  async notifyManagersForIncompleteHabits() {
    const today = this.dayKey();
     this.logger.log('CRON RUNNING');

    const members = await this.userModel.find({
      role: 'member',
      managerId: { $ne: null },
      workspaceId: { $ne: null },
    });

    const managerAlerts = new Map<string, MemberAlert[]>();

    for (const member of members) {
      const habits = await this.habitModel.find({
        userId: member._id.toString(),
      });
      if (!habits.length) continue;

      const incompleteCount = habits.filter((h) => {
        const doneToday = h.history.some(
          (x) => x.date === today && x.completed,
        );
        return !doneToday;
      }).length;

      if (incompleteCount <= 0) continue;

      const managerId = member.managerId?.toString();
      if (!managerId) continue;

      const list = managerAlerts.get(managerId) || [];
      list.push({
        memberName: member.name,
        incompleteCount,
        totalHabits: habits.length,
      });
      managerAlerts.set(managerId, list);
    }

    for (const [managerId, alerts] of managerAlerts) {
      const alreadySent = await this.logModel.findOne({
        managerId,
        dateKey: today,
        type: 'incomplete-habits',
      });
      if (alreadySent) continue;

      const manager = await this.userModel.findById(managerId);
      if (!manager?.email) continue;

      const lines = alerts.map(
        (a) =>
          `- ${a.memberName}: ${a.incompleteCount}/${a.totalHabits} habits incomplete today`,
      );

      const subject = `Habit Alert (${today}) - Incomplete student habits`;
      const text = `Hello ${manager.name},

These students have incomplete habits today:
${lines.join('\n')}

- Habit Tracker`;

      try {
        await this.sendMail(manager.email, subject, text);
        await this.logModel.create({
          managerId,
          dateKey: today,
          type: 'incomplete-habits',
        });
        this.logger.log(`Sent mentor alert email to ${manager.email}`);
      } catch (err) {
        this.logger.error(
          `Failed sending mentor email to ${manager.email}`,
          err as any,
        );
      }
    }
  }

  async getManagerHistory(managerId: string){
    return this.logModel
    .find({managerId, type: 'incomplete-habits'})
    .sort({createdAt: -1})
    .limit(20);
  }
}
