import {
  Body,
  Controller,
  Delete,
  Get,
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
}
