import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('summary')
  async getSummary(@Req() req: any) {
    return this.dashboardService.getSummary(req.user.id);
  }

  @Get('weak-topics')
  async getWeakTopics(@Req() req: any) {
    return this.dashboardService.getWeakTopics(req.user.id);
  }

  @Get('activity')
  async getActivity(@Req() req: any) {
    return this.dashboardService.getActivity(req.user.id);
  }
}
