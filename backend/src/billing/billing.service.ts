import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BillingService {
  private razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  constructor(private usersService: UsersService) {}

  async createMentorOrder(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('User not found');
    if (user.role! == 'manager')
      throw new ForbiddenException('only manager can pay');

    const amountInPaise = Number(
      process.env.MANAGER_PLAN_AMOUNT_PAISE ?? '19900',
    );

    const order = await this.razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${userId}_${Date.now()}`,
      notes: { userId },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyMentorPayment(
    userId: string,
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new BadRequestException('user not found');
    if (user.role !== 'manager')
      throw new ForbiddenException(' only manager can verify payment');

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      await this.usersService.updateById(userId, {
        subscriptionStatus: 'failed',
      });
      throw new BadRequestException('Invalid payment signature');
    }

    const updated = await this.usersService.updateById(userId, {
      subscriptionStatus: 'active',
    });
    return { success: true, user: updated };
  }
}
