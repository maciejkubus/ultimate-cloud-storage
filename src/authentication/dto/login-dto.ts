import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @ApiProperty({
    example: 'john_doe',
    description: 'User name',
  })
  username: string;

  @IsString()
  @ApiProperty({
    example: 'H2@da)_d2$JJ2kke',
    description: 'User password',
  })
  password: string;
}
