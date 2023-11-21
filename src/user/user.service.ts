import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProviderType, User } from './models/user.model';
import { IGoggleProfile } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import { Response } from 'express';
import { SignupDto } from './dto/signupdto';
import { SigninDto } from './dto/signin.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async googleAuthCallback({ provider, email, displayName }: IGoggleProfile) {
    try {
      const exist = await this.userRepository.findOne({
        where: { email },
      });
      if (!exist) {
        const salt = await genSalt(10);
        const hashed_password = await hash(email, salt);
        const user = await this.userRepository.create({
          provider,
          email,
          full_name: displayName,
          hashed_password,
        });
        const token = await this.jwtService.signAsync(
          { id: user.id },
          {
            secret: process.env.GOOGLE_TOKEN_KEY,
            expiresIn: process.env.GOOGLE_TOKEN_TIME,
          },
        );
        return {
          status: 201,
          message: 'user created',
          data: user,
          token,
        };
      }

      const token = await this.jwtService.signAsync(
        { id: exist.id },
        {
          secret: process.env.GOOGLE_TOKEN_KEY,
          expiresIn: process.env.GOOGLE_TOKEN_TIME,
        },
      );
      return {
        status: 200,
        message: 'successfully signed',
        data: exist,
        token,
      };
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
        provider: ProviderType.local,
        ...signupDto,
      });
      const jwt_payload = { id: user.id };
      const token = await this.generateToken(jwt_payload);
      await this.mailService.sendUserConfirmation(user, token.access_token);
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
