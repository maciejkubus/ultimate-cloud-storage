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
import { CreateEmotionCheckDto } from './dto/create-emotion-check.dto';
import { UpdateEmotionCheckDto } from './dto/update-emotion-check.dto';
import { EmotionChecksService } from './emotion-check.service';
import { EmotionCheckGuard } from './guards/emotion-check-owner.guard';

@Controller('emotion-checks')
export class EmotionChecksController {
  constructor(private readonly emotionChecksService: EmotionChecksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateEmotionCheckDto, @Request() req) {
    return this.emotionChecksService.create(dto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  findAll(@Request() req) {
    return this.emotionChecksService.findAll(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), EmotionCheckGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emotionChecksService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), EmotionCheckGuard)
  @Post(':id/add/:emotionId')
  addEmotion(@Param('id') id, @Param('emotionId') emotionId, @Request() req) {
    return this.emotionChecksService.addEmotion(id, emotionId, req.user.id)
  }

  @UseGuards(AuthGuard('jwt'), EmotionCheckGuard)
  @Delete(':id/add/:emotionId')
  removeEmotion(@Param('id') id, @Param('emotionId') emotionId, @Request() req) {
    return this.emotionChecksService.removeEmotion(id, emotionId, req.user.id)
  }

  @UseGuards(AuthGuard('jwt'), EmotionCheckGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmotionCheckDto,
  ) {
    return this.emotionChecksService.update(+id, dto);
  }

  @UseGuards(AuthGuard('jwt'), EmotionCheckGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emotionChecksService.remove(+id);
  }
}
