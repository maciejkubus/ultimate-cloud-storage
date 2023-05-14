import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @Inject('FILE_REPOSITORY')
    private photoRepository: Repository<File>,
  ) {}

  async findAll(): Promise<File[]> {
    return this.photoRepository.find();
  }
}
