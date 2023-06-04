import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.albumRepository.findOne({ where: { id } });
  }

  async findByUserId(id: number): Promise<Album[]> {
    return await this.albumRepository.find({
      relations: ['user'],
      where: { user: { id } },
    });
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    await this.albumRepository.update(id, updateAlbumDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.albumRepository.delete(id);
  }

  async isAlbumOwner(albumId: number, userId: number): Promise<boolean> {
    const album = await this.findOne(albumId);
    if (!album || !album.user) {
      return false;
    }

    return album.user.id === userId;
  }
}
