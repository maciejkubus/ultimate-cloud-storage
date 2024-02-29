import { Module, forwardRef } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AlbumsModule } from 'src/albums/albums.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { FilesController } from './files.controller';
import { filesProviders } from './files.providers';
import { FilesService } from './files.service';
import { PublicController } from './public.controller';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule,
    AuthenticationModule,
    forwardRef(() => AlbumsModule),
  ],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
  controllers: [FilesController, PublicController],
})
export class FilesModule {}
