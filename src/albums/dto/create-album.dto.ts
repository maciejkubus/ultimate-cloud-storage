import { IsString, Length } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  @Length(3, 50)
  title: string;
}
