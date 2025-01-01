import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { UsersService } from 'src/users/users.service';
import { Between, Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { generateStats } from './stats/generate-stats';

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

  async findAllByUserId(id: number, query: PaginateQuery) {
    return paginate(query, this.expensesRepository, {
      relations: ['user'],
      where: { user: { id } },
      sortableColumns: ['name', 'description', 'category', 'tags', 'amount', 'isTransactionOut', 'created', 'updated'],
      defaultSortBy: [['created', 'DESC']],
      searchableColumns: ['name', 'description', 'category', 'tags'],
      filterableColumns: {
        amount: [FilterOperator.EQ, FilterOperator.SW, FilterOperator.LT],
        name: [FilterOperator.CONTAINS],
        description: [FilterOperator.CONTAINS],
        category: [FilterOperator.CONTAINS],
        tags: [FilterOperator.CONTAINS]
      },
      maxLimit: 100,
      defaultLimit: 100,
    })
    return await this.expensesRepository.find({
      relations: ['user'],
      where: { user: { id } }
    })
  }

  async findInMonthByUserId(id: number, date: string,  query: PaginateQuery) {
    const dateParts = date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const fromDate = new Date(`${year}-${(month < 10 ? '0' : '') + month}-01 00:00:00`);
    const lastDay = new Date(year, month, 0);
    const toDate = new Date(`${year}-${(month < 10 ? '0' : '') + month}-${lastDay.getDate()} 23:59:59`);

    return paginate(query, this.expensesRepository, {
      relations: ['user'],
      where: { user: { id }, created: Between(fromDate, toDate) },
      sortableColumns: ['name', 'description', 'category', 'tags', 'amount', 'isTransactionOut', 'created', 'updated'],
      defaultSortBy: [['created', 'DESC']],
      searchableColumns: ['name', 'description', 'category', 'tags'],
      filterableColumns: {
        amount: [FilterOperator.EQ, FilterOperator.SW, FilterOperator.LT],
        name: [FilterOperator.CONTAINS],
        description: [FilterOperator.CONTAINS],
        category: [FilterOperator.CONTAINS],
        tags: [FilterOperator.CONTAINS]
      },
      maxLimit: 100,
      defaultLimit: 100,
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
    return `Expense #${id} deleted.`;
  }

  async isOwner(expenseId: number, userId: number): Promise<boolean> {
    const expense = await this.findOne(expenseId);
    if (!expense || !expense.user) {
      return false;
    }

    return expense.user.id === userId;
  }

  async stats(id: number) {
    const expenses = await this.expensesRepository.find({
      relations: ['user'],
      where: { user: { id } },
      order: { created: "ASC" }
    })
    const stats = generateStats(expenses);
    return stats;
  }
}
