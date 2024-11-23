import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateExpensesTagDto } from './dto/create-expenses-tag.dto';
import { UpdateExpensesTagDto } from './dto/update-expenses-tag.dto';
import { ExpensesTagsService } from './expenses-tags.service';
import { ExpensesTagOwnerGuard } from './guards/expenses-tag-owner.guard';

@Controller('expenses-tags')
export class ExpensesTagsController {
  constructor(private readonly expensesTagsService: ExpensesTagsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createExpensesTagDto: CreateExpensesTagDto, @Request() req) {
    return this.expensesTagsService.create(createExpensesTagDto, +req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllMine(@Request() req) {
    return await this.expensesTagsService.findAllByUserId(+req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), ExpensesTagOwnerGuard)
  @Get()
  findOne(@Param('id') id: string) {
    return this.expensesTagsService.findOne(+id);
  }


  @UseGuards(AuthGuard('jwt'), ExpensesTagOwnerGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpensesTagDto: UpdateExpensesTagDto) {
    return this.expensesTagsService.update(+id, updateExpensesTagDto);
  }

  @UseGuards(AuthGuard('jwt'), ExpensesTagOwnerGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesTagsService.remove(+id);
  }
}
