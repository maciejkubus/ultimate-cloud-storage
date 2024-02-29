import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Request,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { join } from 'path';
import { File } from './entities/file.entity';
import { FilesService } from './files.service';
import { FileOwnerGuard } from './guards/file-owner.guard';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  @ApiResponse({
    status: 200,
    description: 'Files of logged in user.',
    type: [File],
  })
  findMine(@Request() req, @Paginate() query: PaginateQuery) {
    return this.filesService.findByUserId(req.user.id, query);
  }

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'File',
    type: File,
  })
  async findOne(@Param('id') id: number, @Request() req) {
    return this.filesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Get(':id/download')
  @ApiResponse({
    status: 200,
    description: 'File stream for download.',
  })
  async downloadOne(
    @Param('id') id,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const file = await this.filesService.findOne(+id);

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

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Get(':id/preview')
  @ApiResponse({
    status: 200,
    description: 'File stream for preview.',
  })
  async previewOne(
    @Param('id') id,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const file = await this.filesService.findOne(+id);

    const headers = {};
    if (file.mimetype) headers['Content-Type'] = file.mimetype;
    res.set(headers);

    const streamableFile = createReadStream(join(process.cwd(), file.path));
    return new StreamableFile(streamableFile);
  }

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Post(':id/share')
  @ApiResponse({
    status: 200,
    description: 'File shared',
  })
  async shareFile(@Param('id') id: number, @Request() req) {
    const file = await this.filesService.share(+id)
    return file;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'File uploaded.',
    type: File,
  })
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 124000000 })],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ) {
    return this.filesService.create(file, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'File deleted.',
  })
  async deleteFile(@Param('id') id: number, @Request() req) {
    await this.filesService.delete(+id);
    return { message: 'File deleted successfully' };
  }

  private async validateUser(fileId: number, userId: number) {
    const file = await this.filesService.findOne(+fileId);

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.user.id !== userId) {
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );
    }
  }
}
