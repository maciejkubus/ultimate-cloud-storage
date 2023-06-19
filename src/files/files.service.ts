import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { AlbumsService } from 'src/albums/albums.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FILE_REPOSITORY')
    private fileRepository: Repository<File>,
    private usersService: UsersService,
    @Inject(forwardRef(() => AlbumsService))
    private albumService: AlbumsService,
    private moduleRef: ModuleRef,
  ) {}

  async findAll(): Promise<File[]> {
    return this.fileRepository.find();
  }

  async findOne(id: number): Promise<File> {
    return await this.fileRepository.findOne({
      relations: ['user'],
      where: { id },
    });
  }

  async findByUserId(id: number): Promise<File[]> {
    return await this.fileRepository.find({
      relations: ['user'],
      where: { user: { id } },
    });
  }

  async findByIds(ids: number[]): Promise<File[]> {
    const files = [];
    for (const id of ids) {
      const file = await this.findOne(id);
      if (file) {
        files.push(file);
      }
    }
    return files;
  }

  async create(file: Express.Multer.File, userId: number): Promise<File> {
    const newFile = new File();
    newFile.originalName = file.originalname;
    newFile.filename = file.filename;
    newFile.mimetype = file.mimetype ? file.mimetype : null;
    newFile.size = file.size;
    newFile.path = file.path;

    const user = await this.usersService.findOne(userId);
    newFile.user = user;

    await this.fileRepository.save(newFile);
    return newFile;
  }

  async delete(id: number): Promise<void> {
    // remove thumbnail from albums
    const albums = await this.albumService.findAllWithThumbnail(id);
    for (const album of albums) {
      await this.albumService.updateThumbnail(album.id, { fileId: null });
    }

    await this.fileRepository.delete({ id });
  }

  async isFileOwner(fileId: number, userId: number): Promise<boolean> {
    const file = await this.findOne(fileId);
    if (!file || !file.user) {
      return false;
    }

    return file.user.id === userId;
  }
}
