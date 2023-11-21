import { Module } from '@nestjs/common';
import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Poll } from './models/poll.model';

@Module({
  imports: [SequelizeModule.forFeature([Poll])],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
