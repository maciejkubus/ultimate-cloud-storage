import { ApiProperty } from '@nestjs/swagger';
import { hashSync } from 'bcryptjs';
import { Addiction } from 'src/addiction/entities/addiction.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Note } from 'src/note/entities/note.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from '../../albums/entities/album.entity';
import { File } from '../../files/entities/file.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique identifier' })
  id?: number;

  @Column('text')
  @Unique(['username'])
  @ApiProperty({ example: 'john_doe', description: 'User name' })
  username: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  @Unique(['email'])
  @ApiProperty({ example: 'user@domain.com', description: 'User email' })
  email: string;

  @Column('text')
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

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  @OneToMany(() => Album, (album) => album.user)
  albums: Album[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => Addiction, (addiction) => addiction.user)
  addictions: Addiction[];

  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: Expense[];

  private tempPassword?: string;

  // @AfterLoad()
  // private loadTempPassword(): void {
  //   this.tempPassword = this.password;
  // }

  // @BeforeInsert()
  // @BeforeUpdate()
  // private encryptPassword(): void {
  //   if (this.tempPassword !== this.password) {
  //     this.password = hashSync(this.password, 8);
  //   }
  // }

  public hashPassword(password: string): void {
    this.password = hashSync(password, 8);
  }
}
