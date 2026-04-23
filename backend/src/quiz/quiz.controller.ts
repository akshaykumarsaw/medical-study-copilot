import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
  constructor(private quizService: QuizService) {}

  @Post('generate')
  async generate(
    @Req() req: any,
    @Body('subject') subject: string,
    @Body('numQuestions') numQuestions: number,
    @Body('difficulty') difficulty: string,
  ) {
    return this.quizService.generateQuiz(req.user.userId, subject, numQuestions || 5, difficulty || 'mixed');
  }

  @Post('generate-targeted')
  async generateTargeted(
    @Req() req: any,
    @Body('numQuestions') numQuestions: number,
  ) {
    return this.quizService.generateWeakAreaQuiz(req.user.userId, numQuestions || 5);
  }

  @Post(':id/submit')
  async submit(
    @Req() req: any,
    @Param('id') quizId: string,
    @Body('answers') answers: number[],
    @Body('timeTakenSeconds') timeTakenSeconds: number,
  ) {
    return this.quizService.submitQuiz(req.user.id, quizId, answers, timeTakenSeconds || 0);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    return this.quizService.getHistory(req.user.id);
  }
}
