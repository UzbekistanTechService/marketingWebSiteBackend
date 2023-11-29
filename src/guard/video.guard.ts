import {
  Injectable,
  ExecutionContext,
  CanActivate,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from 'src/order/models/order.model';
import { Video } from 'src/video/models/video.model';

@Injectable()
export class VideoGuard implements CanActivate {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(Video) private videoRepository: typeof Video,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const req = context.switchToHttp().getRequest();
      const order = await this.orderRepository.findOne({
        where: { user_id: req.user.id },
      });
      if (!order) {

      }
      const video = await this.videoRepository.findOne({
        where: { course_id: order.course_id },
      });

      if (!video) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You have not purchased this video',
        });
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return true;
  }
}
