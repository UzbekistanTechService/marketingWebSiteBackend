import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/poll.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('poll')
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) { }

  @Post('create')
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }

  @ApiOperation({ summary: 'Get all polls' })
  @Get('all')
  findAll() {
    return this.pollService.findAll();
  }

  @ApiOperation({ summary: 'Get poll by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(id);
  }
}
