import { DataSource } from 'typeorm';
import { Event } from './entities/event.entity';

export const eventsProviders = [
  {
    provide: 'EVENTS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Event),
    inject: ['DATA_SOURCE'],
  },
];
