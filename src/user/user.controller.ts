import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GoogleOauthGuard } from 'src/guard/google-oauth.guard';
import { ApiOperation } from '@nestjs/swagger';
import { CookieGetter } from 'src/decorators/cookieGetter.decorator';
import { Response } from 'express';
import { SigninDto } from './dto/signin.dto';
import { SignupDto } from './dto/signupdto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  authGoogle() {}

  @HttpCode(200)
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any) {
    return this.userService.googleAuthCallback(req.user);
  }

  @ApiOperation({ summary: 'Sign up' })
  @Post('signup')
  signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.signup(signupDto, res);
  }

  @ApiOperation({ summary: 'Sign in' })
  @Post('signin')
  signin(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.signin(signinDto, res);
  }

  @ApiOperation({ summary: 'Sign out' })
  @Post('signout')
  signout(
    @CookieGetter('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.signout(refresh_token, res);
  }
}
