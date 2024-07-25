import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateAddictionDto } from './dto/create-addiction.dto';
import { UpdateAddictionDto } from './dto/update-addiction.dto';
import { Addiction } from './entities/addiction.entity';

@Injectable()
export class AddictionService {
  constructor(
    @Inject('ADDICTION_REPOSITORY')
    private addictionRepository: Repository<Addiction>,
    private usersService: UsersService,
  ) {}

  async create(createAddictionDto: CreateAddictionDto, userId: number): Promise<Addiction> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const addiction = this.addictionRepository.create(createAddictionDto);
    addiction.user = user;
    return await this.addictionRepository.save(addiction);
  }

  findAll(id: number, query: PaginateQuery): Promise<Paginated<Addiction>> {
    return paginate(query, this.addictionRepository, {
      relations: ['user'],
      where: { user: { id } },
      sortableColumns: ['id']
    });
  }

  findOne(id: number, userId: number): Promise<Addiction> {
    return this.addictionRepository.findOne({
      relations: ['user'],
      where: { 
        id,
        user: {
          id: userId,
        }
       }
    })
  }

  async update(id: number, updateAddictionDto: UpdateAddictionDto) {
    await this.addictionRepository.update(id, updateAddictionDto);
    return await this.addictionRepository.findOne({
      relations: ['user'],
      where: {
        id,
      }
    })
  }

  remove(id: number) {
    return this.addictionRepository.delete(id)
  }

  async isAddictionOwner(addictionId: number, userId: number): Promise<boolean> {
    const addiction = await this.findOne(addictionId, userId)
    
    if (!addiction || !addiction.user) {
      return false;
    }


    return addiction.user.id === userId;
  }
}
