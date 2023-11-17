import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { User } from './models/user.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy],
})
export class UserModule {}
