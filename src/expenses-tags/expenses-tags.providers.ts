import { DataSource } from 'typeorm';
import { ExpensesTag } from './entities/expenses-tag.entity';

export const expensesTagsProviders = [
  {
    provide: 'EXPENSES_TAGS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ExpensesTag),
    inject: ['DATA_SOURCE'],
  },
];
