import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PollServiceType } from '../models/poll.model';

export class CreatePollDto {
  @ApiProperty({
    type: 'string',
    example: '998901234567',
  })
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty({
    type: 'string',
    example: 'SMM Marketing Services',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    type: 'enum',
    enum: PollServiceType,
    example: 'smm',
  })
  @IsNotEmpty()
  @IsEnum(PollServiceType)
  service: PollServiceType;
}
