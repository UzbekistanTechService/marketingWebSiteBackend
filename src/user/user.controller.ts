import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GoogleOauthGuard } from 'src/guard/google-oauth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @HttpCode(200)
  @UseGuards(GoogleOauthGuard)
  @Get('google')
  authGoogle() { }

  @HttpCode(200)
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    return this.userService.googleAuthCallback(req.user, res);
  }
}
