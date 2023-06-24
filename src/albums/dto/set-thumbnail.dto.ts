import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class SetThumbnailDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
  })
  fileId?: number;
}
