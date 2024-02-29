import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/albums/entities/album.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id: number;

  @CreateDateColumn()
  @ApiProperty({
    example: '2023-06-04T22:42:33.278Z',
    description: 'User created date',
  })
  created?: Date;

  @UpdateDateColumn()
  @ApiProperty({
    example: '2023-06-04T22:42:33.278Z',
    description: 'User last updated date',
  })
  updated?: Date;

  @Column('text')
  @ApiProperty({ example: 'file.txt', description: 'File original name' })
  originalName: string;

  @Column({ length: 500 })
  @ApiProperty({ example: 'file.txt', description: 'File name' })
  filename: string;

  @Column('text', { nullable: true })
  @ApiProperty({ example: 'image/jpeg', description: 'File mime type' })
  mimetype?: string;

  @Column('int')
  @ApiProperty({ example: 1000000, description: 'File size in bytes' })
  size: number;

  @Column('text')
  @ApiProperty({
    example: 'uploads/file.txt',
    description: 'File path on server',
  })
  path: string;

  @Column('text', { default: 'private' })
  @ApiProperty({
    example: 'public',
    description: 'public',
  })
  access: string;

  @ManyToOne(() => User, (user) => user.files, { nullable: true })
  @ApiProperty({ description: 'User', type: () => User })
  user?: User;

  @ManyToOne(() => Album, (album) => album.files, { nullable: true })
  @ApiProperty({ description: 'User', type: () => User })
  album?: Album;
}
