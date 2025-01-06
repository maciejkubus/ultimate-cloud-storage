import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;

  @Column('text')
  text: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  sender?: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  receiver?: User;
}
