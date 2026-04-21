import { Module } from '@nestjs/common';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TutorController],
  providers: [TutorService]
})
export class TutorModule {}
