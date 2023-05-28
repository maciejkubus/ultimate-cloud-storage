import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  originalName: string;

  @Column({ length: 500 })
  filename: string;

  @Column('text', { nullable: true })
  mimetype?: string;

  @Column('int')
  size: number;

  @Column('text')
  path: string;

  @ManyToOne(() => User, (user) => user.files, { nullable: true })
  user?: User;
}
