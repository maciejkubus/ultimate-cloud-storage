import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { FilesController } from './files.controller';
import { filesProviders } from './files.providers';
import { FilesService } from './files.service';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      dest: './uploads',
    }),
    UsersModule,
    AuthModule,
  ],
  providers: [FilesService, ...filesProviders],
  exports: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
