import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;

  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { nullable: true })
  category?: string;

  @Column('text', { nullable: true })
  tags?: string;

  @Column('float', { default: '0'})
  amount: number;

  @Column('boolean', { default: true })
  isTransactionOut?: boolean;

  @ManyToOne(() => User, (user) => user.expenses, { nullable: true })
  user?: User;
}
