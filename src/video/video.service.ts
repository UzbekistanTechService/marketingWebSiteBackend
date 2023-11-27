import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { createReadStream, statSync } from 'fs';
import { Response } from 'express';
import { Video } from './models/video.model';
import { InjectModel } from '@nestjs/sequelize';
import { join } from 'path';
@Injectable()
export class VideoService {
  constructor(@InjectModel(Video) private videoRepository: typeof Video) {}
  async getStreamVideo(res: Response, headers: any, id: number) {
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

        res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
        readStreamfile.pipe(res);
      } else {
        const head = {
          'Content-Length': size,
        };

        res.writeHead(HttpStatus.OK, head);
        createReadStream(videoPath).pipe(res);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll() {
    try {
      const videos = await this.videoRepository.findAll({
        include: { all: true },
      });
      return videos;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page_limit: string) {
    try {
      const page = Number(page_limit.split('-')[0]);
      const limit = Number(page_limit.split('-')[1]);
      const offset = (page - 1) * limit;
      const videos = await this.videoRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.videoRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        videos,
        pagination: {
          currentPage: page,
          total_pages,
          total_count,
        },
      };
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getByID(id: number) {
    try {
      const video = await this.videoRepository.findByPk(id, {
        include: { all: true },
      });
      if (!video) {
        return {
          message: 'Video not found!',
        };
      }
      return video;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
