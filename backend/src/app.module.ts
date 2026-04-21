import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TutorModule } from './tutor/tutor.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
    DashboardModule,
    TutorModule,
    QuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
