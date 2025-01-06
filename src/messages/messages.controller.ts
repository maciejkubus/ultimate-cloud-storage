import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/send/:receiverId')
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req, @Param('receiverId') receiverId: number) {
    return await this.messagesService.create(createMessageDto, req.user.id, receiverId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/conversation/:receiverId')
  async findOne(@Request() req, @Param('receiverId') receiverId: number, @Paginate() query: PaginateQuery) {
    return await this.messagesService.getConversation(+req.user.id, receiverId, query)
  }
}
