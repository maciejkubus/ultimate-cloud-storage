import { DataSource, DataSourceOptions } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const devOptions: DataSourceOptions = {
        type: 'better-sqlite3',
        database : process.env.SQLITE_DB,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.ENVIROMENT === 'dev',
      };
      const prodOptions: DataSourceOptions = {
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: process.env.ENVIROMENT === 'dev',
      };
      const dataSource = new DataSource(
        process.env.ENVIROMENT === 'prod' ? prodOptions : devOptions,
      );

      return dataSource.initialize();
    },
  },
];
