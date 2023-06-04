import { ApiProperty } from '@nestjs/swagger';
import { File } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @ManyToMany(() => File, { eager: true })
  @JoinTable()
  @ApiProperty({ description: 'Files', type: () => [File] })
  files: File[];
}
