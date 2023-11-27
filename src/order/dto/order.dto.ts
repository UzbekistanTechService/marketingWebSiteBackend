import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class OrderDto {
    @ApiProperty({
        type: 'number',
        example: '1'
    })
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @ApiProperty({
        type: 'number',
        example: '1'
    })
    @IsNotEmpty()
    @IsNumber()
    course_id: number; 
}
