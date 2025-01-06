import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesController } from './messages.controller';
import { messagesProviders } from './messages.providers';
import { MessagesService } from './messages.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, ...messagesProviders],
})
export class MessagesModule {}
