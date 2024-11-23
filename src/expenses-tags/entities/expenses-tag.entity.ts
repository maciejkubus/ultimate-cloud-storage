import { Expense } from "src/expenses/entities/expense.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ExpensesTag {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;

  @Column('text')
  name: string;

  @Column('text', { default: '#FFFFFF' })
  color: string;

  @ManyToOne(() => User, (user) => user.expenses, { nullable: true })
  user?: User;

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];
}
