import { DataSource } from 'typeorm';
import { Addiction } from './entities/addiction.entity';

export const addictionsProviders = [
  {
    provide: 'ADDICTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Addiction),
    inject: ['DATA_SOURCE'],
  },
];
