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
      const poll = await this.pollRepository.create({
        name: createPollDto.name,
        phone_number: createPollDto.phone_number,
        service: createPollDto.service,
      });

      return {
        status: 201,
        message: 'Poll successfully created',
        data: poll,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const polls = await this.pollRepository.findAll();
      return {
        status: 200,
        message: 'Return all polls',
        data: polls,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const poll = await this.pollRepository.findOne({ where: { id } });

      if (!poll) {
        return {
          status: 404,
          message: 'Poll with this id was not found!',
        };
      }

      return {
        status: 200,
        message: 'Return all polls',
        data: poll,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
