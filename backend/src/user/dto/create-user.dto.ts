import { ApiProperty } from '@nestjs/swagger';
import { NormalizeEmail, Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
  IsEnum,
  Length,
  Matches,
} from 'class-validator';

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  @ApiProperty({
    description: "Le nom d'utilisateur unique",
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores.",
  })
  userName: string;

  @ApiProperty({
    description: "L'adresse email unique de l'utilisateur'",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  @NormalizeEmail()
  email: string;

  @ApiProperty({
    description: "Le mot de passe de l'uilisateur",
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: "L'URL de l'avatar de l'utilisateur",
    example: 'https://example.com/avatar.jpg/johndoe.png',
  })
  @IsUrl()
  @IsNotEmpty()
  avatar_url: string;

  @ApiProperty({
    description: "Rôle de l'utilisateur",
    enum: Roles,
    example: 'USER',
  })
  @IsEnum(Roles)
  @IsNotEmpty()
  role: Roles;
}
