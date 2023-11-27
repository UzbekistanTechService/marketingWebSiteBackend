import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderDto } from './dto/order.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @ApiOperation({ summary: 'Create a new order' })
  @Post()
  create(@Body() orderDto: OrderDto) {
    return this.orderService.create(orderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @Get()
  getAll() {
    return this.orderService.getAll();
  }

  @ApiOperation({ summary: 'Get orders with pagination' })
  @Get('pagination/:page-limt')
  pagination(@Query('page-limit') page_limit: string) {
    return this.orderService.pagination(page_limit);
  }

  @ApiOperation({ summary: 'Get order by user ID and course ID' })
  @Get(':ids')
  getOne(@Param('ids') ids: string) {
    return this.orderService.getOne(ids);
  }

  @ApiOperation({ summary: 'Get order by ID' })
  @Get('id/:id')
  getByID(@Param('id') id: number) {
    return this.orderService.getByID(id);
  }

  @ApiOperation({ summary: 'Delete order' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.orderService.delete(id);
  }
}
