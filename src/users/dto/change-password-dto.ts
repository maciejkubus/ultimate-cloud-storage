import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({
    example: '123456789',
    description: 'Current user password',
  })
  currentPassword: string;

  @IsString()
  @ApiProperty({
    example: 'H2@da)_d2$JJ2kke',
    description: 'New user password',
  })
  newPassword: string;
}
