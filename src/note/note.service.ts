import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NoteService {
  constructor(
    @Inject('NOTE_REPOSITORY')
    private noteRepository: Repository<Note>,
    private usersService: UsersService,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: number): Promise<Note> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const note = this.noteRepository.create(createNoteDto);
    note.user = user;
    return await this.noteRepository.save(note);
  }

  findAll(): Promise<Note[]> {
    return this.noteRepository.find();
  }

  findByUserId(id: number, query: PaginateQuery): Promise<Paginated<Note>> {
    return paginate(query, this.noteRepository, {
      relations: ['user'],
      where: { user: { id } },
      sortableColumns: ['id']
    });
  }

  findOne(id: number): Promise<Note> {
    return this.noteRepository.findOne({
      relations: ['user'],
      where: { id }
    })
  }

  findOneByUserId(id: number, userId: number): Promise<Note> {
    return this.noteRepository.findOne({
      relations: ['user'],
      where: { 
        id,
        user: {
          id: userId,
        }
       }
    })
  }

  async isNoteOwner(noteId: number, userId: number): Promise<boolean> {
    const note = await this.findOne(noteId);
    console.log(note)
    if (!note || !note.user) {
      return false;
    }


    return note.user.id === userId;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    await this.noteRepository.update(id, updateNoteDto);
    return await this.findOne(id);
  }

  remove(id: number) {
    return this.noteRepository.delete(id)
  }
}
