import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @Inject('EXPENSES_REPOSITORY')
    private expensesRepository: Repository<Expense>,
    private usersService: UsersService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number) {
    const user = await this.usersService.findOne(userId);

    if(!user)
      throw new NotFoundException('User not found')

    const expense = await this.expensesRepository.create(createExpenseDto)
    expense.user = user
    return await this.expensesRepository.save(expense);
  }

  async findAllByUserId(id: number) {
    return await this.expensesRepository.find({
      relations: ['user'],
      where: { user: { id } }
    })
  }

  findOne(id: number) {
    return this.expensesRepository.findOne({
      relations: ['user'],
      where: { id }
    })
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    await this.expensesRepository.update(id, updateExpenseDto);
    return this.findOne(id)
  }

  async remove(id: number) {
    await this.expensesRepository.delete(id);
    return `Note ${id} deleted.`;
  }

  async isOwner(expenseId: number, userId: number): Promise<boolean> {
    const expense = await this.findOne(expenseId);
    if (!expense || !expense.user) {
      return false;
    }


    return expense.user.id === userId;
  }
}
