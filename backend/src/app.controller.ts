import { Controller, Get, Head, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthGet() {
    return { status: 'ok' };
  }

  @Head('health')
  @HttpCode(200)
  healthHead() {
    return;
  }
}
