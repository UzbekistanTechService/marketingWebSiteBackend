import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      username: process.env.PG_USERNAME,
      host: process.env.PG_HOST,
      port: +process.env.PG_PORT,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASS,
      autoLoadModels: true,
      logging: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
