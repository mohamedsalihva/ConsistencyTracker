import { Controller, Post, Get,Patch,Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { HabitsService } from './habits.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateHabitDto } from './dto/create-habit.dto';
import { updateHabitDto } from './dto/update-habit-dto';

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

  @Patch(':id')
  renameHabit(@Req() req, @Param('id') id: string, @Body() dto: updateHabitDto){
    return this.habitsService.renameHabit(id, req.user.id, dto.title);
  }

  @Delete(':id')
  deleteHabit(@Req() req, @Param('id') id: string){
    return this.habitsService.deleteHabit(id, req.user.id);
  }
}
