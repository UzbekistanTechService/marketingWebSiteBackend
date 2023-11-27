import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './models/cart.model';
import { UserModule } from 'src/user/user.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [SequelizeModule.forFeature([Cart]), UserModule, CourseModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
