import {
  Controller,
  Get,
  Header,
  Headers,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { VideoService } from './video.service';
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('stream/:id')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async getStreamVideo(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: Headers,
    @Res() res: Response,
  ) {
    return this.videoService.getStreamVideo(res, headers, id);
  }
}
