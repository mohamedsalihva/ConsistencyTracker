import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('habits')
@UseGuards(AuthGuard('jwt'))
export class HabitsController {
    constructor(private habitService: HabitsService){}

    @Post('create')
    createHabit(@Req() req, @Body('title') title: string){
        return this.habitService.createHabit(req.user.id,title);
    }
    
  @Get()
  get(@Req() req) {
    return this.habitService.getHabit(req.user.id);
  }

  @Post('complete/:id')
  complete(@Req() req, @Param('id') id: string) {
    return this.habitService.markComplete(id, req.user.id);
  }
}
