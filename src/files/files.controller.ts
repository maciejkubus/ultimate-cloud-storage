import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { FilesService } from './files.service';
import { FileOwnerGuard } from './guards/file-owner.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  async findMine(@Request() req) {
    return await this.filesService.findByUserId(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Request() req) {
    return this.filesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Get(':id/download')
  async downloadOne(
    @Param('id') id,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    return this.filesService.downloadOne(+id, res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.filesService.create(file, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), FileOwnerGuard)
  @Delete(':id')
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
