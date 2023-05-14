import { DataSource } from 'typeorm';
import { File } from './entities/file.entity';

export const filesProviders = [
  {
    provide: 'FILE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(File),
    inject: ['DATA_SOURCE'],
  },
];
