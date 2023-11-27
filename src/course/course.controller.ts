import { Controller, Get, Param, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Get all courses' })
  @Get()
  getAll() {
    return this.courseService.getAll();
  }

  @ApiOperation({ summary: 'Get courses with pagination' })
  @Get('pagination/:page-limit')
  pagination(@Query('page-limit') page_limit: string) {
    return this.courseService.pagination(page_limit);
  }

  @ApiOperation({ summary: 'Get course by id' })
  @Get(':id')
  getById(@Param('id') id: number) {
    return this.courseService.getByID(id);
  }
}
