import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

@Controller('billing')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Post('create-order')
  createOrder(@Req() req: any) {
    return this.billingService.createMentorOrder(req.user.id);
  }

  @Post('verify-payment')
  verifyPayment(
    @Req() req: any,
    @Body()
    dto: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ) {
    return this.billingService.verifyMentorPayment(
      req.user.id,
      dto.razorpay_order_id,
      dto.razorpay_payment_id,
      dto.razorpay_signature,
    );
  }
}
