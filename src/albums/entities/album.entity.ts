import { AlbumFile } from 'src/database/entities/album-file.entity';
import { File } from 'src/files/entities/file.entity';
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
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;

  @Column('text')
  title: string;

  @ManyToOne(() => User, (user) => user.albums, { nullable: true, eager: true })
  user?: User;

  @ManyToMany(() => File, (file) => file.albumFiles)
  albumFiles: AlbumFile[];
}
