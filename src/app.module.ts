import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlbumsModule } from './albums/albums.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { NoteModule } from './note/note.module';
import { MailModule } from './mail/mail.module';
import { AddictionModule } from './addiction/addiction.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
