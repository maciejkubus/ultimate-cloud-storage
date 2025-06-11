import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { EmotionsController } from './emotions.controller';
import { emotionsProviders } from './emotions.providers';
import { EmotionsService } from './emotions.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [EmotionsController],
  providers: [EmotionsService, ...emotionsProviders],
})
export class EmotionsModule {}
