import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './models/cart.model';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { CreateCartDto } from './dto/cart.dto';
import { Op } from 'sequelize';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart) private cartRepository: typeof Cart,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}
  async create(cartDto: CreateCartDto) {
    try {
      const { user_id, course_id } = cartDto;
      await this.userService.getByID(user_id);
      await this.courseService.getByID(course_id);
      const exist = await this.getOne(`${user_id}-${course_id}`);
      if (exist) {
        return { message: 'Already exist cart!' };
      }
      const cart = await this.cartRepository.create(cartDto);
      return cart;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll() {
    const carts = await this.cartRepository.findAll({ include: { all: true } });
    return carts;
  }

  async getByID(id: number) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { id },
        include: { all: true },
      });

      if (!cart) {
        return { message: 'Cart not found' };
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async delete(id: number) {
    try {
      await this.getByID(id);
      await this.cartRepository.destroy({ where: { id } });
      return { message: 'Course deleted from cart' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOne(ids: string) {
    try {
      const user_id = Number(ids.split('-'))[0];
      const course_id = Number(ids.split('-'))[1];
      const cart = await this.cartRepository.findOne({
        where: {
          [Op.and]: [{ user_id }, { course_id }],
        },
        include: { all: true },
      });
      return cart;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
