import {
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FILE_REPOSITORY')
    private fileRepository: Repository<File>,
    private usersService: UsersService,
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

  async downloadOne(id: number, res: Response): Promise<StreamableFile> {
    const file = await this.findOne(id);
    if (!file) throw new NotFoundException('File not found');

    const headers = {};
    if (file.mimetype) headers['Content-Type'] = file.mimetype;
    if (file.originalName)
      headers[
        'Content-Disposition'
      ] = `attachment; filename="${file.originalName}"`;
    res.set(headers);

    const streamableFile = createReadStream(join(process.cwd(), file.path));
    return new StreamableFile(streamableFile);
  }

  async findByUserId(id: number): Promise<File[]> {
    return await this.fileRepository.find({
      relations: ['user'],
      where: { user: { id } },
    });
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
    await this.fileRepository.delete({ id });
  }
}
