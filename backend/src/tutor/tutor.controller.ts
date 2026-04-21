import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tutor')
@UseGuards(JwtAuthGuard)
export class TutorController {
  constructor(private tutorService: TutorService) {}

  @Post('ask')
  async askQuestion(
    @Req() req: any,
    @Body('question') question: string,
    @Body('subject') subject?: string,
    @Body('topic') topic?: string,
  ) {
    return this.tutorService.askQuestion(req.user.id, question, subject, topic);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    return this.tutorService.getHistory(req.user.id);
  }
}
