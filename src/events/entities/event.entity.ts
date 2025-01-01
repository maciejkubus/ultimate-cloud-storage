import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Event {
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
    description?: string | null;
  
    @Column('text')
    type: "event" | "task";

    @Column('text')
    color: string;

    @Column('timestamp')
    start: Date;

    @Column('timestamp', { nullable: true })
    end?: Date | null;
  
    @ManyToOne(() => User, (user) => user.expenses, { nullable: true })
    user?: User;
}
