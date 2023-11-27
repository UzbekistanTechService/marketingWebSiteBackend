import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateCartDto {
  @ApiProperty({
    type: 'number',
    example: '12',
  })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({
    type: 'number',
    example: '12',
  })
  @IsNumber()
  @IsNotEmpty()
  course_id: number;
}
