import { ApiProperty } from "@nestjs/swagger";
import { Emotion } from "src/emotions/entities/emotion.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class EmotionCheck {
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

  @Column('decimal', { default: 0})
  day: number;

  @Column('decimal', { default: 0})
  month: number;

  @Column('decimal', { default: 0})
  year: number;

  @Column('decimal', { default: 0})
  hour: number;

  @Column('decimal', { default: 0})
  minute: number;

  @ManyToOne(() => User, (user) => user.emotionChecks, { nullable: true })
  @ApiProperty({ description: 'User', type: () => User })
  user?: User;

  @ManyToMany(() => Emotion, (emotion) => emotion.emotionChecks, { cascade: true })
  @JoinTable()
  emotions?: Emotion[];
}