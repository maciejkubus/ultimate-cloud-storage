import { DataSource } from 'typeorm';
import { Message } from './entities/message.entity';

export const messagesProviders = [
  {
    provide: 'MESSAGES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: ['DATA_SOURCE'],
  },
];
