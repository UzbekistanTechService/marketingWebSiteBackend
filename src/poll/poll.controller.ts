import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/poll.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('poll')
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @ApiOperation({ summary: 'Send poll service' })
  @Post('create')
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollService.create(createPollDto);
  }

  @ApiOperation({ summary: 'Get all polls' })
  @Get()
  findAll() {
    return this.pollService.getAll();
  }

  @ApiOperation({ summary: 'Get polls with pagination' })
  @Get('pagination/:page-limit')
  pagination(@Query('page-limit') page_limit: string) {
    return this.pollService.pagination(page_limit);
  }

  @ApiOperation({ summary: 'Get poll by id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.getByID(id);
  }
}
