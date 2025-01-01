import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { EventsController } from './events.controller';
import { eventsProviders } from './events.providers';
import { EventsService } from './events.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [EventsController],
  providers: [EventsService, ...eventsProviders],
})
export class EventsModule {}
