import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import {
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password-dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'username', 'email'],
      defaultSortBy: [['username', 'ASC']],
      searchableColumns: ['username', 'email'],
      filterableColumns: {
        username: [FilterOperator.EQ],
        email: [FilterOperator.EQ],
      },
    });
  }

  async findOneBy(
    options: FindOptionsWhere<User> | FindOptionsWhere<User>[],
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

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<User> {
    const user = await await this.userRepository.findOne({
      select: ['id', 'username', 'password', 'email'],
      where: { id },
    });
    const validated = await this.validateUser(
      user.username,
      data.currentPassword,
    );
    if (!validated) throw new ForbiddenException('Invalid password');
    user.hashPassword(data.newPassword);
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

  async isNotGuest(id: number) {
    const user = await this.findOne(id);
    return user.role != 'guest';
  }
}
