import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ExpensesModule } from 'src/expenses/expenses.module';
import { UsersModule } from 'src/users/users.module';
import { ExpensesTagsController } from './expenses-tags.controller';
import { expensesTagsProviders } from './expenses-tags.providers';
import { ExpensesTagsService } from './expenses-tags.service';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    ExpensesModule
  ],
  controllers: [ExpensesTagsController],
  providers: [ExpensesTagsService, ...expensesTagsProviders],
})
export class ExpensesTagsModule {}
