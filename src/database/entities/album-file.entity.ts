import { Album } from 'src/albums/entities/album.entity';
import { File } from 'src/files/entities/file.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlbumFile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Album, (album) => album.albumFiles, { onDelete: 'CASCADE' })
  album: Album;

  @ManyToOne(() => File, (file) => file.albumFiles, { onDelete: 'CASCADE' })
  file: File;
}
