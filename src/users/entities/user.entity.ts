import { hashSync } from 'bcrypt';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  @Unique(['username'])
  username: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  @Unique(['email'])
  email: string;

  @Column('text')
  @CreateDateColumn()
  created?: Date;

  @UpdateDateColumn()
  updated?: Date;

  private tempPassword?: string;

  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private encryptPassword(): void {
    if (this.tempPassword !== this.password) {
      this.password = hashSync(this.password, 8);
    }
  }
}
