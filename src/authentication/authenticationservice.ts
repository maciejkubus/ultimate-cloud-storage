import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    return await this.usersService.validateUser(username, password);
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({ id: user.id }),
      user: user,
    };
  }

  async register(userData: Partial<User>) {
    const userExist = await this.usersService.findOneBy([
      { username: userData.username },
      { email: userData.email },
    ]);
    if (!userExist) {
      const user = await this.usersService.create(userData);
      user.hashPassword(userData.password);
      return this.usersService.update(user.id, user);
    }

    if (userExist.username === userData.username)
      throw new BadRequestException('Username already exist');

    if (userExist.email === userData.email)
      throw new BadRequestException('Email already exist');
  }
}
