import { DataSource } from 'typeorm';
import { Emotion } from './entities/emotion.entity';

export const emotionsProviders = [
  {
    provide: 'EMOTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Emotion),
    inject: ['DATA_SOURCE'],
  },
];
