
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class SendMailDto {
  @IsString()
  @IsEmail()
  @Length(3, 50)
  @ApiProperty({
    example: 'user@domain.com',
  })
  to: string;

  @IsString()
  @Length(3, 50)
  @ApiProperty({
    example: 'subject',
  })
  subject: string;

  @IsString()
  @Length(3, 500)
  @ApiProperty({
    example: 'content',
  })
  content: string;
}
