import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { AlbumsController } from './albums.controller';
import { albumProviders } from './albums.providers';
import { AlbumsService } from './albums.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, ...albumProviders],
})
export class AlbumsModule {}
