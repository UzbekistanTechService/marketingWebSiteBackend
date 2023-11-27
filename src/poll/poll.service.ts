import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePollDto } from './dto/poll.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Poll } from './models/poll.model';

@Injectable()
export class PollService {
  constructor(
    @InjectModel(Poll) private readonly pollRepository: typeof Poll,
  ) {}
  async create(createPollDto: CreatePollDto) {
    try {
      const poll = await this.pollRepository.create(createPollDto);
      return poll;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAll() {
    try {
      const polls = await this.pollRepository.findAll();
      return polls;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async pagination(page_limit: string) {
    try {
      const page = Number(page_limit.split('-')[0]);
      const limit = Number(page_limit.split('-')[1]);
      const offset = (page - 1) * limit;
      const polls = await this.pollRepository.findAll({
        include: { all: true },
        offset,
        limit,
      });
      const total_count = await this.pollRepository.count();
      const total_pages = Math.ceil(total_count / limit);
      const response = {
        polls,
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

  async getByID(id: string) {
    try {
      const poll = await this.pollRepository.findByPk(id);
      if (!poll) {
        return {
          message: 'Poll not found!',
        };
      }
      return poll;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
