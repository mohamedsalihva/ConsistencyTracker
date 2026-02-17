import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHabitDto } from './dto/create-habit.dto';

@Controller('habits')
@UseGuards(AuthGuard('jwt'))
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  createHabit(@Req() req, @Body() dto: CreateHabitDto) {
    return this.habitsService.createHabit(req.user.id, dto.title);
  }

  @Get()
  getHabits(@Req() req) {
    return this.habitsService.getHabits(req.user.id);
  }

  @Post('complete/:id')
  complete(@Req() req, @Param('id') id: string) {
    return this.habitsService.markComplete(id, req.user.id);
  }
}
