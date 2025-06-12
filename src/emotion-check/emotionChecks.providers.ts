import { DataSource } from 'typeorm';
import { EmotionCheck } from './entities/emotion-check.entity';

export const emotionChecksProviders = [
  {
    provide: 'EMOTION_CHECK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(EmotionCheck),
    inject: ['DATA_SOURCE'],
  },
];