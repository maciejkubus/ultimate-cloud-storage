import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddictionModule } from './addiction/addiction.module';
import { AlbumsModule } from './albums/albums.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { ExpensesModule } from './expenses/expenses.module';
import { FilesModule } from './files/files.module';
import { MailModule } from './mail/mail.module';
import { NoteModule } from './note/note.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    FilesModule,
    AuthenticationModule,
    UsersModule,
    AlbumsModule,
    NoteModule,
    MailModule,
    AddictionModule,
    ExpensesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
