import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'john_doe',
    description: 'User name',
    required: false,
  })
  username: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: 'user@domain.com',
    description: 'User email',
    required: false,
  })
  email: string;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2023-06-04T22:42:33.278Z',
    description: 'User created date',
    required: false,
  })
  created: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '2023-06-04T22:42:33.278Z',
    description: 'User last updated date',
    required: false,
  })
  updated: Date;
}
