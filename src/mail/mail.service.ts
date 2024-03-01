import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {

  transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE == 'TRUE',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    } as any);
  }
  async send(sendMailDto: SendMailDto) {
    const info = await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: sendMailDto.to,
      subject: sendMailDto.subject,
      text: sendMailDto.content,
    });
    return info;
  }
}
