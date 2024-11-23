import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { ExpensesController } from './expenses.controller';
import { expensesProviders } from './expenses.providers';
import { ExpensesService } from './expenses.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ...expensesProviders],
  exports: [ExpensesService],
})
export class ExpensesModule {}
