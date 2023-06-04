import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  @ApiProperty({
    example: 'john_doe',
    description: 'User name',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  @ApiProperty({
    example: 'H2@da)_d2$JJ2kke',
    description: 'User password',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'user@domain.com',
    description: 'User email',
  })
  email: string;

  files = [];
}
