import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VideoService } from './video.service';
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}
}
