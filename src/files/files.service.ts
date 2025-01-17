import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
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

  async share(id: number) {
    const file = await this.findOne(id);
    file.access = 'public';
    await this.fileRepository.save(file);
    return file;
  }

  findByUserId(id: number, query: PaginateQuery): Promise<Paginated<File>> {
    return paginate(query, this.fileRepository, {
      relations: ['user', 'album'],
      where: { user: { id } },
      sortableColumns: ['id', 'originalName', 'mimetype', 'size', 'album.id'],
      searchableColumns: ['id', 'originalName', 'mimetype', 'size', 'album.id'],
      filterableColumns: {
        originalName: [FilterOperator.EQ],
        mimetype: [FilterOperator.EQ],
        size: [
          FilterOperator.EQ,
          FilterOperator.GT,
          FilterOperator.LT,
          FilterOperator.GTE,
          FilterOperator.LTE,
        ],
        'album.id': [FilterOperator.EQ],
      },
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

  async isFilePublic(fileId: number) {
    const file = await this.findOne(fileId);
    return file.access == 'public';
  }

  async syncData(userId: number) {
    const files = await this.fileRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });
    return files.map(file => file.originalName);
  }
}
