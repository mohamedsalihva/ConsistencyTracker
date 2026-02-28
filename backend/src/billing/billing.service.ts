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
    
    const role = String

    if (user.role !== "manager")
      throw new ForbiddenException('Register as manager first');

    if(user.subscriptionStatus === 'active'){
      throw new ForbiddenException('manager subscription already active');
    }


    const amountInPaise = Number(
      process.env.MANAGER_PLAN_AMOUNT_PAISE ?? '19900',
    );
    if(!Number.isFinite(amountInPaise) || amountInPaise <=0){
      throw new BadRequestException("Invalid MANAGER_PLAN_AMOUNT_PAISE")
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new BadRequestException("Razorpay keys are missing in .env");
}

    await this.usersService.updateById(userId, {
      subscriptionStatus: 'pending',
    })
try {
  const order = await this.razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `r_$${Date.now()}`,
    notes: { userId },
  });
  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  };
} catch (e: any) {
  throw new BadRequestException(e?.error?.description || e?.message || "Razorpay order create failed");
}

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
