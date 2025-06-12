import { ApiProperty } from "@nestjs/swagger";
import { EmotionCheck } from "src/emotion-check/entities/emotion-check.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Emotion {
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
  name: string;

  @Column('text')
  emoticon: string;

  @ManyToOne(() => User, (user) => user.emotions, { nullable: true })
  @ApiProperty({ description: 'User', type: () => User })
  user?: User;

  @ManyToMany(() => EmotionCheck, (emotionCheck) => emotionCheck.emotions)
  emotionChecks: EmotionCheck[];
}
