import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @Inject('ALBUM_REPOSITORY')
    private albumRepository: Repository<Album>,
    private usersService: UsersService,
    private fileService: FilesService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, userId: number): Promise<Album> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const album = this.albumRepository.create(createAlbumDto);
    album.user = user;
    return await this.albumRepository.save(album);
  }

  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  findOne(id: number): Promise<Album> {
    return this.albumRepository.findOne({
      relations: ['files'],
      where: { id },
    });
  }

  async findByUserId(id: number): Promise<Album[]> {
    return await this.albumRepository.find({
      relations: ['user'],
      where: { user: { id } },
    });
  }

  async findWithFiles(fileId: number): Promise<Album[]> {
    return await this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.files', 'file')
      .where('file.id = :fileId', { fileId })
      .getMany();
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    await this.albumRepository.update(id, updateAlbumDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const album = await this.findOne(id);
    if (album.files.length > 0) {
      throw new BadRequestException('Album is not empty');
    }

    return this.albumRepository.delete(id);
  }

  async isAlbumOwner(albumId: number, userId: number): Promise<boolean> {
    const album = await this.findOne(albumId);
    if (!album || !album.user) {
      return false;
    }

    return album.user.id === userId;
  }

  async addFilesToAlbum(
    album: Album,
    fileIds: number[],
    userId: number,
  ): Promise<void> {
    const files = await this.fileService.findByIds(fileIds);
    files.forEach((file) => {
      if (file.user.id !== userId) {
        throw new BadRequestException(
          `File #${file.id} does not belong to user`,
        );
      }
    });
    album.files = [...album.files, ...files];
    album.files = album.files.filter(
      (file, index, self) => self.findIndex((f) => f.id === file.id) === index,
    );
    await this.albumRepository.save(album);
  }

  async removeFilesFromAlbum(
    album: Album,
    fileIds: number[],
    userId: number,
  ): Promise<void> {
    album.files = album.files.filter((file) => !fileIds.includes(file.id));
    await this.albumRepository.save(album);
  }
}
