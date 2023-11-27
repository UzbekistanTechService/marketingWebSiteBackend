import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/cart.dto';
import { ApiOperation } from '@nestjs/swagger';
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Create cart' })
  @HttpCode(201)
  @Post('create')
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @ApiOperation({ summary: 'All carts' })
  @HttpCode(200)
  @Get()
  getAll() {
    return this.cartService.getAll();
  }

  @ApiOperation({ summary: 'Cart get by id' })
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.getByID(id);
  }

  @ApiOperation({ summary: 'Cart delete by id' })
  @HttpCode(200)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.delete(id);
  }
}
