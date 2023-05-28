import { hashSync } from 'bcrypt';
import { Album } from 'src/albums/entities/album.entity';
import { File } from 'src/files/entities/file.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
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

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  @OneToMany(() => Album, (album) => album.user)
  albums: Album[];

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
