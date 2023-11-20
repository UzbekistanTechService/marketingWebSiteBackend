import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) { }

  async googleAuthCallback(user, res: Response) {
    try {
      const existUser = await User.findOne({ where: { email: user.email } });

      if (!existUser) {

      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
