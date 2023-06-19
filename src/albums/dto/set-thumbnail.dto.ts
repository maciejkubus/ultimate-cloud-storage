import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SetThumbnailDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
  })
  fileId: number;
}
