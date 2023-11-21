import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class forgotPasswordDto {
    @ApiProperty({
        type: 'string',
        example: 'example@gmail.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg4ZmM0NmYyLTlmNmQtNDA3Ny04ODlmLTJjZmU2ZjRjOGUxMSIsImlhdCI6MTcwMDU1OTg4NSwiZXhwIjoxNzAwNTYzNDg1fQ.TpFysSwomLpfER6HdRrbu8fbBRXvvtfOfk4l5Fdn-JU',
    })
    @IsNotEmpty()
    @IsString()
    token: string;

    @ApiProperty({
        type: 'string',
        example: 'User123!',
    })
    @IsNotEmpty()
    @IsString()
    new_password: string;

    @ApiProperty({
        type: 'string',
        example: 'User123!',
    })
    @IsNotEmpty()
    @IsString()
    confirm_new_password: string;
}