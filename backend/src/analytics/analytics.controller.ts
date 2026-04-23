import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('error-log')
  async getErrorLog(@Req() req: any) {
    return this.analyticsService.getErrorLog(req.user.id);
  }

  @Get('mastery')
  async getMasteryOverview(@Req() req: any) {
    return this.analyticsService.getMasteryOverview(req.user.id);
  }

  @Get('activity')
  async getActivityStats(@Req() req: any) {
    return this.analyticsService.getActivityStats(req.user.id);
  }
}
