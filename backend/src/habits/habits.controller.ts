import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHabitDto } from './dto/create-habit.dto';

@Controller('habits')
@UseGuards(AuthGuard('jwt'))
export class HabitsController {
    constructor(private habitService: HabitsService){}

    @Post('create')
    createHabit(@Req() req, @Body() dto: CreateHabitDto){
        return this.habitService.createHabit(req.user.id,dto.title);
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

