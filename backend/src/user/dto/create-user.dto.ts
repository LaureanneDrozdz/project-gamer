import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: "Le nom d'utilisateur unique",
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: "L\'adresse email unique de l\'utilisateur'",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Le mot de passe de l\'uilisateur",
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: "L\URL de l\avatar de l\'utilisateur",
    example: 'https://example.com/avatar.jpg/johndoe.png',
  })
  @IsUrl()
  @IsNotEmpty()
  avatar_url: string;
}
