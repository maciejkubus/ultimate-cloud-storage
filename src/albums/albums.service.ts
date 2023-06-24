import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { SetThumbnailDto } from './dto/set-thumbnail.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
@Injectable()
export class AlbumsService {
  constructor(
    @Inject('ALBUM_REPOSITORY')
    private albumRepository: Repository<Album>,
    private usersService: UsersService,
    @Inject(forwardRef(() => FilesService))
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
      // relations: ['files'],
      where: { id },
    });
  }

  findByUserId(id: number, query: PaginateQuery): Promise<Paginated<Album>> {
    return paginate(query, this.albumRepository, {
      relations: ['user'],
      where: { user: { id } },
      sortableColumns: ['id', 'title'],
      defaultSortBy: [['title', 'ASC']],
      searchableColumns: ['title'],
      filterableColumns: {
        title: [FilterOperator.EQ],
      },
    });
  }

  async findWithFiles(fileId: number): Promise<Album[]> {
    return await this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.files', 'file')
      .where('file.id = :fileId', { fileId })
      .getMany();
  }

  async findAllWithThumbnail(fileId: number): Promise<Album[]> {
    return await this.albumRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.thumbnail', 'thumbnail')
      .where('thumbnail.id = :fileId', { fileId })
      .getMany();
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    await this.albumRepository.update(id, updateAlbumDto);
    return this.findOne(id);
  }

  async updateThumbnail(albumId: number, setThumbnailDto: SetThumbnailDto) {
    const album = await this.findOne(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    if (setThumbnailDto.fileId == null) {
      album.thumbnail = null;
      return this.albumRepository.save(album);
    }

    const file = await this.fileService.findOne(setThumbnailDto.fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (!album.files.find((f) => f.id === file.id)) {
      throw new BadRequestException('File is not in album');
    }

    album.thumbnail = file;

    return this.albumRepository.save(album);
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
