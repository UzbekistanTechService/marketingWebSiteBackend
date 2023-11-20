import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { IGoggleProfile } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async googleAuthCallback(
    { provider, email, displayName }: IGoggleProfile,
    res: Response,
  ) {
    try {
      const existUser = await this.userRepository.findOne({
        where: { email },
      });
      console.log(existUser);
      
      if (!existUser) {
        const newUser = await this.userRepository.create({
          provider,
          email,
          full_name: displayName,
          hashed_password: email,
        });
        const token = await this.jwtService.signAsync({ id: newUser.id });

         return {
          status: 201,
          message: 'user created',
          data: newUser,
          token
         }
      }
      
      const token = await this.jwtService.signAsync({ id: existUser.id });
      return {
        status: 200,
        message: 'successfully signed',
        data: existUser,
        token
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
