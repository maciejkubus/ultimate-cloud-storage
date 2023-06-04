import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddFilesDto {
  @IsArray()
  @ApiProperty({
    example: [1, 2, 3],
  })
  files: number[];
}
