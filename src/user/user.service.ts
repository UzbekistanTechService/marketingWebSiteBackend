import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { IGoggleProfile } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signupdto';
import { Response } from 'express';
import { hash, compare } from 'bcrypt';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) { }

  async googleAuthCallback({ provider, email, displayName }: IGoggleProfile) {
    try {
      const existUser = await this.userRepository.findOne({
        where: { email },
      });
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


  async signup(signupDto: SignupDto, res: Response) {
    try {
      const candidate = await this.userRepository.findOne({
        where: { email: signupDto.email },
      });
      if (candidate) {
        return { message: 'This email is already registered!' };
      }
      const hashed_password = await hash(signupDto.password, 7);
      const user = await this.userRepository.create({
        hashed_password,
        ...signupDto,
      });
      const jwt_payload = { id: user.id };
      const token = await this.generateToken(jwt_payload);
      this.writeToCookie(token.refresh_token, res);
      return {
        message: 'User registreted successfully',
        user,
        token: token.access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signin(signinDto: SigninDto, res: Response) {
    try {
      const { email, password } = signinDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return { message: 'User not found!' };
      }
      const is_match = await compare(password, user.hashed_password);
      if (!is_match) {
        return { message: 'Invalid password!' };
      }
      const jwt_payload = { id: user.id };
      const token = await this.generateToken(jwt_payload);
      this.writeToCookie(token.refresh_token, res);
      return {
        message: 'User logged in successfully',
        user,
        token: token.access_token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async signout(refresh_token: string, res: Response) {
    try {
      const data = await this.jwtService.verify(refresh_token, {
        secret: process.env.REFRESH_TOKEN_KEY,
      });
      if (!data) {
        return { message: 'Logout error!' };
      }
      const user = await this.userRepository.findOne({
        where: { id: data.id },
      });
      if (!user) {
        return { message: 'Unregistered user!' };
      }
      res.clearCookie('refresh_token');
      return { message: 'User logged out successfully', user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  private async generateToken(jwt_payload: object) {
    try {
      const [access_token, refresh_token] = await Promise.all([
        this.jwtService.signAsync(jwt_payload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }),
        this.jwtService.signAsync(jwt_payload, {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        }),
      ]);
      return { access_token, refresh_token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async writeToCookie(refresh_token: string, res: Response) {
    try {
      res.cookie('refresh_token', refresh_token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
