import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { NoteController } from './note.controller';
import { notesProviders } from './note.providers';
import { NoteService } from './note.service';

@Module({
  imports: [
    DatabaseModule,
    UsersModule
  ],
  controllers: [NoteController],
  providers: [NoteService, ...notesProviders]
})
export class NoteModule {}
