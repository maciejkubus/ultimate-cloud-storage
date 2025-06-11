import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { EmotionsService } from './emotions.service';
import { EmotionOwnerGuard } from './guards/addiction-owner.guard';

@Controller('emotions')
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createEmotionDto: CreateEmotionDto, @Request() req) {
    return this.emotionsService.create(createEmotionDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  findAll(@Request() req) {
    return this.emotionsService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), EmotionOwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.emotionsService.findOne(+id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), EmotionOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmotionDto: UpdateEmotionDto) {
    return this.emotionsService.update(+id, updateEmotionDto);
  }

  @UseGuards(AuthGuard('jwt'), EmotionOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emotionsService.remove(+id);
  }
}
