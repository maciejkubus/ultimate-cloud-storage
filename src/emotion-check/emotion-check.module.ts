import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EmotionsModule } from 'src/emotions/emotions.module';
import { UsersModule } from 'src/users/users.module';
import { EmotionChecksController } from './emotion-check.controller';
import { EmotionChecksService } from './emotion-check.service';
import { emotionChecksProviders } from './emotionChecks.providers';

@Module({
  imports: [DatabaseModule, UsersModule, EmotionsModule],
  controllers: [EmotionChecksController],
  providers: [EmotionChecksService, ...emotionChecksProviders],
})
export class EmotionCheckModule {}
