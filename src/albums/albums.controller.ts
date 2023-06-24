import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { AlbumsService } from './albums.service';
import { AddFilesDto } from './dto/add-files-dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { RemoveFilesDto } from './dto/remove-files-dto';
import { SetThumbnailDto } from './dto/set-thumbnail.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { AlbumOwnerGuard } from './guards/album-owner.guard';

@ApiTags('Albums')
@ApiBearerAuth()
@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Album created',
    type: Album,
  })
  create(@Body() createAlbumDto: CreateAlbumDto, @Request() req) {
    return this.albumsService.create(createAlbumDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  @ApiResponse({
    status: 200,
    description: 'Albums of logged in user.',
    type: Paginated<Album>,
  })
  async findMine(@Request() req, @Paginate() query: PaginateQuery) {
    return await this.albumsService.findByUserId(req.user.id, query);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Album',
    type: Album,
  })
  findOne(@Param('id') id: string, @Request() req) {
    return this.albumsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Album updated',
    type: Album,
  })
  update(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Request() req,
  ) {
    return this.albumsService.update(+id, updateAlbumDto);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Patch(':id/thumbnail')
  @ApiResponse({
    status: 200,
    description: 'Album thumbnail updated',
    type: Album,
  })
  updateThumbnail(
    @Param('id') id: string,
    @Body() setThumbnailDto: SetThumbnailDto,
    @Request() req,
  ) {
    return this.albumsService.updateThumbnail(+id, setThumbnailDto);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Album deleted',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.albumsService.remove(+id);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Post(':id/add')
  @ApiBody({ type: AddFilesDto })
  @ApiResponse({
    status: 200,
    description: 'Files added to album',
    type: Album,
  })
  async addFilesToAlbum(
    @Param('id') albumId: number,
    @Body() addFilesDto: AddFilesDto,
    @Request() req,
  ) {
    return this.albumsService.addFilesToAlbum(+albumId, addFilesDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), AlbumOwnerGuard)
  @Post(':id/remove')
  @ApiBody({ type: RemoveFilesDto })
  @ApiResponse({
    status: 200,
    description: 'Files removed from album',
    type: Album,
  })
  async removeFilesFromAlbum(
    @Param('id') albumId: number,
    @Body() removeFilesDto: RemoveFilesDto,
    @Request() req,
  ) {

    return this.albumsService.removeFilesFromAlbum(+albumId, removeFilesDto, req.user.id);
  }

  @Get('file/:id')
  @ApiResponse({
    status: 200,
    description: 'Array of albums with by file id',
    type: [Album],
  })
  async findWithFiles(@Param('id') id: string) {
    return this.albumsService.findWithFiles(+id);
  }
}
