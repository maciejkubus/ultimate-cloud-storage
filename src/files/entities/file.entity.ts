import { Album } from 'src/albums/entities/album.entity';
import { AlbumFile } from 'src/database/entities/album-file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;

  @Column('text')
  originalName: string;

  @Column({ length: 500 })
  filename: string;

  @Column('text', { nullable: true })
  mimetype?: string;

  @Column('int')
  size: number;

  @Column('text')
  path: string;

  @ManyToOne(() => User, (user) => user.files, { nullable: true })
  user?: User;

  @ManyToMany(() => Album, (album) => album.albumFiles)
  albumFiles: AlbumFile[];
}
