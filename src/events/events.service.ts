import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
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

  async findEvents(id: number) {
    return await this.eventsRepository.find({
      relations: ['user'],
      where: { user: { id }},
      order: { created: "ASC" }
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
