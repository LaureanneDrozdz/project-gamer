import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim, NormalizeEmail } from 'class-sanitizer';

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  @NormalizeEmail()
  email: string;

  @ApiProperty({
    description: 'Username ',
    example: 'john.doe@example.com',
  })

  @IsNotEmpty()
  @Trim()
  @NormalizeEmail()
  userName: string;

  @ApiProperty({ description: 'User password', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  password: string;

}
