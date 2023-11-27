import {
  Controller,
  Get,
  Header,
  Headers,
  Param,
  ParseIntPipe,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { VideoService } from './video.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('video')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @ApiOperation({ summary: 'Get video of course' })
  @Get('stream/:id')
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  getStreamVideo(
    @Param('id', ParseIntPipe) id: number,
    @Headers() headers: Headers,
    @Res() res: Response,
  ) {
    return this.videoService.getStreamVideo(res, headers, id);
  }

  @ApiOperation({ summary: 'Get all videos' })
  @Get()
  getAll() {
    return this.videoService.getAll();
  }

  @ApiOperation({ summary: 'Get videos with pagination' })
  @Get('page')
  pagination(@Query('page_limit') page_limit: string) {
    return this.videoService.pagination(page_limit);
  }

  @ApiOperation({ summary: 'Get video by ID' })
  @Get(':id')
  getByID(@Param('id') id: number) {
    return this.videoService.getByID(id);
  }
}
