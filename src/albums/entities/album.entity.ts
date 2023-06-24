import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { File } from '../../files/entities/file.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Album {
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
  @ApiProperty({ example: 'My album', description: 'Album title' })
  title: string;

  @ManyToOne(() => User, (user) => user.albums, { nullable: true, eager: true })
  @ApiProperty({ description: 'User', type: () => User })
  user?: User;

  @ManyToOne(() => File, { nullable: true, eager: true })
  @ApiProperty({ description: 'Thumbnail', type: () => File })
  thumbnail?: File;

  @OneToMany(() => File, (file) => file.album)
  files: File[]
}
