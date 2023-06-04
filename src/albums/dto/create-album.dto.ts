import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @Length(3, 50)
  @ApiProperty({
    example: 'Album title',
  })
  title: string;
}
