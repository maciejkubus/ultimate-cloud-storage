import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { filesProviders } from './files.providers';
import { FilesService } from './files.service';

@Module({
  imports: [DatabaseModule],
  providers: [...filesProviders, FilesService],
})
export class FilesModule {}
