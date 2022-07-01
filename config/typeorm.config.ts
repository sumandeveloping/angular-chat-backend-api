import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: (process.env.DB_PORT as unknown as number) || 5432,
  username: process.env.POSTGRES_USER,
  password: 'mychatapp',
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/*entity.{js,ts}'],
  subscribers: [__dirname + '/../**/*subscriber.{js,ts}'],
  autoLoadEntities: true,
  synchronize: true,
  cache: false,
};
