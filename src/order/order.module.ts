import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { UserModule } from 'src/user/user.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [SequelizeModule.forFeature([Order]), UserModule, CourseModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
