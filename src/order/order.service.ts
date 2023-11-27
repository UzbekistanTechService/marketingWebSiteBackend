import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './models/order.model';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { OrderDto } from './dto/order.dto';
import { Op } from 'sequelize';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}

  async create(orderDto: OrderDto) {
    try {
      const { user_id, course_id } = orderDto;
      await this.userService.getByID(user_id);
      await this.courseService.getByID(course_id);
      const exist = await this.getOne(user_id + '-' + course_id);
      if (exist) {
        return { message: 'Bu kurs allaqachon sotib olingan!' };
      }
      const order = await this.orderRepository.create(orderDto);
      return {
        message: 'Kurs sotib olindi',
        order,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll() {
    try {
      const orders = await this.orderRepository.findAll({
        include: { all: true },
      });
      return orders;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page_limit: string) {
    try {
      const page = Number(page_limit.split('-')[0]);
      const limit = Number(page_limit.split('-')[1]);
      const offset = (page - 1) * limit;
      const orders = await this.orderRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.orderRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        orders,
        pagination: {
          currentPage: page,
          total_pages,
          total_count,
        },
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(ids: string) {
    try {
      const user_id = Number(ids.split('-'))[0];
      const course_id = Number(ids.split('-'))[1];
      const order = await this.orderRepository.findOne({
        where: {
          [Op.and]: [{ user_id }, { course_id }],
        },
        include: { all: true },
      });
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByID(id: number) {
    try {
      const order = await this.orderRepository.findByPk(id, {
        include: { all: true },
      });
      if (!order) {
        return { message: 'Sotib olingan kurs topilmadi!' };
      }
      return order;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    try {
      const order = await this.orderRepository.findByPk(id);
      order.destroy();
      return {
        message: "Kurs sotib olingalar ro'yxatidan o'chirildi",
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
