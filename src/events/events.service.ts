import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Between, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
      @Inject('EVENTS_REPOSITORY')
      private eventsRepository: Repository<Event>,
      private usersService: UsersService,
    ) {}

  async create(createEventDto: CreateEventDto, userId: number) {
    const user = await this.usersService.findOne(userId);
    
    if(!user)
      throw new NotFoundException('User not found')

    const event = await this.eventsRepository.create(createEventDto)
    event.user = user
    return await this.eventsRepository.save(event);
  }

  async findOne(id: number) {
    return await this.eventsRepository.findOne({
      relations: ['user'],
      where: { id }
    })
  }

  async findDate(date: string, id: number) {
    const dateParts = date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const fromDate = new Date(`${year}-${(month < 10 ? '0' : '') + month}-01 00:00:00`);
    const lastDay = new Date(year, month, 0);
    const toDate = new Date(`${year}-${(month < 10 ? '0' : '') + month}-${lastDay.getDate()} 23:59:59`);

    return await this.eventsRepository.find({
      relations: ['user'],
      where: { user: { id }, created: Between(fromDate, toDate) },
    })
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    await this.eventsRepository.update(id, updateEventDto);
    return this.findOne(id)
  }

  async remove(id: number) {
    await this.eventsRepository.delete(id);
    return `Event #${id} deleted.`;
  }

  async isOwner(eventId: number, userId: number) {
    const event = await this.findOne(eventId);
    if (!event || !event.user) {
      return false;
    }

    return event.user.id === userId;
  }
}
