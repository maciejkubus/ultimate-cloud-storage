import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SendMailDto } from './dto/send-mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  send(@Body() sendMailDto: SendMailDto) {
    return this.mailService.send(sendMailDto);
  }
}
