import { ApiProperty } from '@nestjs/swagger';
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
export class Addiction {
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
  title: string;

  @Column('date')
  soberDate: string;

  @ManyToOne(() => User, (user) => user.addictions, { nullable: true })
  @ApiProperty({ description: 'User', type: () => User })
  user?: User;
}