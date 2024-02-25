import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import { NoteOwnerGuard } from './guards/note-owner.guard';
import { NoteService } from './note.service';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Note created',
    type: Note,
  })
  create(@Body() createNoteDto: CreateNoteDto, @Request() req) {
    return this.noteService.create(createNoteDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  @ApiResponse({
    status: 200,
    description: 'Notes of logged in user.',
    type: Paginated<Note>,
  })
  async findMine(@Request() req, @Paginate() query: PaginateQuery) {
    return await this.noteService.findByUserId(req.user.id, query);
  }

  @UseGuards(AuthGuard('jwt'), NoteOwnerGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Note',
    type: Note,
  })
  findOne(@Param('id') id: string, @Request() req) {
    return this.noteService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), NoteOwnerGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Note updated',
    type: Note,
  })
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Request() req,
  ) {
    return this.noteService.update(+id, updateNoteDto);
  }

  @UseGuards(AuthGuard('jwt'), NoteOwnerGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Note deleted',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.noteService.remove(+id);
  }
}
