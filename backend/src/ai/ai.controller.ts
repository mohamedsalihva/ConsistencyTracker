import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
@UseGuards(AuthGuard('jwt'))
export class AiController{
   constructor(private readonly aiService: AiService) {}

   @Post('chat')
   async chat(@Req() req:any, @Body() dto: ChatDto){
    const reply = await this.aiService.chat(req.user.id, dto.messages, dto.context);
    return {reply};
   }
}