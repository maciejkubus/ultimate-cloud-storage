import {
  Controller,
  Get,
  Param,
  Request,
  Res,
  StreamableFile,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { File } from './entities/file.entity';
import { FilesService } from './files.service';
import { FilePublicGuard } from './guards/file-public-guard';

@ApiTags('Public')
@ApiBearerAuth()
@Controller('public')
export class PublicController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard('jwt'), FilePublicGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'File',
    type: File,
  })
  async findOne(@Param('id') id: number, @Request() req) {
    return this.filesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), FilePublicGuard)
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

  @UseGuards(AuthGuard('jwt'), FilePublicGuard)
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
}
