import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';
import { Video } from './models/video.model';
import { InjectModel } from '@nestjs/sequelize';
import { join } from 'path';
@Injectable()
export class VideoService {
  constructor(@InjectModel(Video) private videoRepository: typeof Video) {}
  async getStreamVideo(res: Response, headers, id: number) {
    try {
      const existVideo = await this.videoRepository.findOne({ where: { id } });
      if (!existVideo) {
        return {
          message: 'Video not found',
        };
      }
      const videoPath = join(__dirname, '..', 'static', existVideo.file_name);
      const { size } = statSync(videoPath);
      const videoRange = headers.range;
      if (videoRange) {
        console.log(videoRange);
        const parts = videoRange.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
        const chunkSize = end - start + 1;
        const readStreamfile = createReadStream(videoPath, {
          start,
          end,
          highWaterMark: 60,
        });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${size}`,
          'Content-Length': chunkSize,
        };

        res.writeHead(HttpStatus.PARTIAL_CONTENT, head); //206
        readStreamfile.pipe(res);
      } else {
        const head = {
          'Content-Length': size,
        };

        res.writeHead(HttpStatus.OK, head); //200
        createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
