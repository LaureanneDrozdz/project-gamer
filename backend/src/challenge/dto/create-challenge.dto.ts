import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsBoolean, IsOptional, IsUrl, IsUUID } from 'class-validator';
import { Trim, Escape } from 'class-sanitizer';

enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export class CreateChallengeDto {
  @ApiProperty({
    description: 'Titre du challenge',
    example: 'Speedrun World 1-1',
  })
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Escape()
  title: string;

  @ApiProperty({
    description: 'Description détaillée du challenge',
    example: 'Terminez le premier niveau du jeu en moins de 30 secondes',
  })
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Escape()
  description: string;

  @ApiProperty({
    description: 'Règles spécifiques à suivre pour le challenge',
    example:
      'Pas de bugs ou glitches autorisés. Le chrono commence dès que le niveau est chargé.',
  })
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Escape()
  rules: string;

  @ApiProperty({
    description: 'Nom du jeu concerné par le challenge',
    example: 'Super Mario Bros',
  })
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Escape()
  game: string;

  @ApiProperty({
    description: 'Niveau de difficulté du challenge',
    enum: Difficulty,
    example: 'MEDIUM',
  })
  @IsEnum(Difficulty)
  @IsNotEmpty()
  difficulty: Difficulty;

  @ApiProperty({
    description: 'Statut de validation du challenge (par défaut false)',
    example: false,
    default: false,
  })
  @IsBoolean()
  validated: boolean = false;

  @ApiProperty({ description: 'ID of the creator' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Url image of the Challenge' })
  @IsOptional()
  @IsUrl()
  image_url?: string;
}
