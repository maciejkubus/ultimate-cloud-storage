import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../database/database.module';
import { usersProviders } from './user.providers';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule],
      controllers: [UsersController],
      providers: [UsersService, ...usersProviders],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await usersService.findAll();
      console.log(result);
      jest
        .spyOn(usersService, 'findAll')
        .mockImplementation(async () => result);

      expect(await usersController.findAll()).toBe(result);
    });
  });
});
