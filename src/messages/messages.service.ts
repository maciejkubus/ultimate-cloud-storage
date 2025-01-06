import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGES_REPOSITORY')
    private messagesRepository: Repository<Message>,
    private usersService: UsersService,
  ) {}

  async create(createMessageDto: CreateMessageDto, senderId: number, receiverId: number) {
    const sender = await this.usersService.findOne(senderId);
    const receiver = await this.usersService.findOne(receiverId);

    if (!sender) 
      throw new NotFoundException('Sender not found');
    if (!receiver) 
      throw new NotFoundException('Receiver not found');
    
    const message = await this.messagesRepository.create({
      text: createMessageDto.text,
      sender,
      receiver,
    })

    return await this.messagesRepository.save(message);

  }

  findOne(id: number) {
    return this.messagesRepository.findOne({
      where: { id },
    });
  }

  async getConversation(senderId: number, receiverId: number, query: PaginateQuery) {
    const messages = await paginate(query, this.messagesRepository, {
      relations: ['sender', 'receiver'],
      where: [
        { sender: { id: senderId }, receiver: { id: receiverId } },
        { sender: { id: receiverId }, receiver: { id: senderId } }
      ],
      select: ['id', 'created', 'text', 'sender.id', 'receiver.id'],
      sortableColumns: ['created'],
      defaultSortBy: [['created', 'DESC']],
      searchableColumns: ['text'],
      defaultLimit: 100,
    })
    return messages;
  }

  async isSender(msgId: number, userId: number): Promise<boolean> {
    const msg = await this.findOne(msgId);
    if (!msg || !msg.sender) {
      return false;
    }

    return msg.sender.id === userId;
  }
}
