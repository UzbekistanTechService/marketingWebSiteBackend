import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';
import { User } from './user/models/user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      username: process.env.PG_HOST,
      host: process.env.PG_PORT,
      port: +process.env.PG_USER,
      database: process.env.PG_PASS,
      password: process.env.PG_DB,
      models: [User],
      logging: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
