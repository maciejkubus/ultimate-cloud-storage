import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';
import { ExpenseOwnerGuard } from './guards/expense-owner.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, +req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllMine(@Request() req, @Paginate() query: PaginateQuery) {
    return await this.expensesService.findAllByUserId(+req.user.id, query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stats')
  stats(@Request() req) {
    return this.expensesService.stats(+req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), ExpenseOwnerGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), ExpenseOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @UseGuards(AuthGuard('jwt'), ExpenseOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
