import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateExpensesTagDto } from './dto/create-expenses-tag.dto';
import { UpdateExpensesTagDto } from './dto/update-expenses-tag.dto';
import { ExpensesTag } from './entities/expenses-tag.entity';

@Injectable()
export class ExpensesTagsService {
  constructor(
    @Inject('EXPENSES_TAGS_REPOSITORY')
    private expensesTagsRepository: Repository<ExpensesTag>,
    private usersService: UsersService,
  ) {}
  
  async create(createExpensesTagDto: CreateExpensesTagDto, userId: number) {
    const user = await this.usersService.findOne(userId);

    if(!user)
      throw new NotFoundException('User not found')

    const expensesTag = await this.expensesTagsRepository.create(createExpensesTagDto);
    expensesTag.user = user;
    return await this.expensesTagsRepository.save(expensesTag);
  }

  async findAllByUserId(id: number) {
    return await this.expensesTagsRepository.find({
      relations: ['user'],
      where: { user: { id } }
    })
  }

  findOne(id: number) {
    return this.expensesTagsRepository.findOne({
      relations: ['user'],
      where: { id }
    })
  }

  async update(id: number, updateExpenseDto: UpdateExpensesTagDto) {
    await this.expensesTagsRepository.update(id, updateExpenseDto);
    return this.findOne(id)
  }

  async remove(id: number) {
    await this.expensesTagsRepository.delete(id);
    return `Expenses Tag #${id} deleted.`;
  }

  async isOwner(expenseId: number, userId: number): Promise<boolean> {
    const expense = await this.findOne(expenseId);
    if (!expense || !expense.user) {
      return false;
    }

    return expense.user.id === userId;
  }
}
