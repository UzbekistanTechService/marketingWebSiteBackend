import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/cart.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Create cart' })
  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @ApiOperation({ summary: 'All carts' })
  @Get()
  getAll() {
    return this.cartService.getAll();
  }

  @ApiOperation({ summary: 'Cart get by id' })
  @Get('id/:id')
  findOne(@Param('id') id: number) {
    return this.cartService.getByID(id);
  }

  @ApiOperation({ summary: 'Get user_id carts' })
  @Get('user_id/:user_id')
  getByUserId(@Param('user_id') user_id: number) {
    return this.cartService.getByUserId(user_id);
  }

  @ApiOperation({ summary: 'Cart delete by id' })
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.cartService.delete(id);
  }
}
