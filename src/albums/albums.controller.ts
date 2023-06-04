import {
  Body,
  Controller,
  Delete,
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
import { AlbumOwnerGuard } from './guards/album-owner.guard';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto, @Request() req) {
    return this.albumsService.create(createAlbumDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  async findMine(@Request() req) {
    return await this.albumsService.findByUserId(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.albumsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Request() req,
  ) {
    return this.albumsService.update(+id, updateAlbumDto);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.albumsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Post(':id/add')
  async addFilesToAlbum(
    @Param('id') albumId: number,
    @Body() addFilesDto: { files: number[] },
    @Request() req,
  ) {
    const album = await this.albumsService.findOne(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.albumsService.addFilesToAlbum(
      album,
      addFilesDto.files,
      req.user.id,
    );
    return album;
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Post(':id/remove')
  async removeFilesFromAlbum(
    @Param('id') albumId: number,
    @Body() removeFilesDto: { files: number[] },
    @Request() req,
  ) {
    const album = await this.albumsService.findOne(albumId);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    await this.albumsService.removeFilesFromAlbum(
      album,
      removeFilesDto.files,
      req.user.id,
    );
    return this.albumsService.findOne(albumId);
  }

  @Get('file/:id')
  async findWithFiles(@Param('id') id: string) {
    return this.albumsService.findWithFiles(+id);
  }
}
