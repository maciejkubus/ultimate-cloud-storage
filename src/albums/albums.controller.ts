import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto, @Request() req) {
    return this.albumsService.create(createAlbumDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    this.validateUser(+id, req.user.id);
    return this.albumsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Request() req,
  ) {
    this.validateUser(+id, req.user.id);
    return this.albumsService.update(+id, updateAlbumDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    this.validateUser(+id, req.user.id);
    return this.albumsService.remove(+id);
  }

  private async validateUser(albumId: number, userId: number) {
    const album = await this.albumsService.findOne(+albumId);

    if (!album) {
      throw new NotFoundException('album not found');
    }

    if (album.user.id !== userId) {
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );
    }
  }
}
