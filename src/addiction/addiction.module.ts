import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { AddictionController } from './addiction.controller';
import { addictionsProviders } from './addiction.providers';
import { AddictionService } from './addiction.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AddictionController],
  providers: [AddictionService, ...addictionsProviders],
})
export class AddictionModule {}
