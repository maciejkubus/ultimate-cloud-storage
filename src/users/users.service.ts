import { Inject, Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneBy(
    options: Partial<User> | Array<Partial<User>>,
  ): Promise<User> {
    return await this.userRepository.findOne({
      where: options,
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.findOneBy({ id });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = new User();
    newUser.username = user.username;
    newUser.password = user.password;
    newUser.email = user.email;
    return this.userRepository.save(newUser);
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await await this.userRepository.findOne({
      select: ['id', 'username', 'password', 'email'],
      where: { username },
    });
    if (user && compareSync(password, user.password)) {
      const { password, ...result } = user;
      return this.findOneBy({ id: user.id });
    }
    return null;
  }
}
