import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  // async googleAuthCallback(user, res: Response) {
  //   try {
  //     const existUser = await User.findOne({ where: { email: user.email } });
      
  //     if (!existUser) {

  //     }
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
