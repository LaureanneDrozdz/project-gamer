import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

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
  title: string;

  @ApiProperty({
    description: 'Description détaillée du challenge',
    example: 'Terminez le premier niveau du jeu en moins de 30 secondes',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Règles spécifiques à suivre pour le challenge',
    example:
      'Pas de bugs ou glitches autorisés. Le chrono commence dès que le niveau est chargé.',
  })
  @IsString()
  @IsNotEmpty()
  rules: string;

  @ApiProperty({
    description: 'Nom du jeu concerné par le challenge',
    example: 'Super Mario Bros',
  })
  @IsString()
  @IsNotEmpty()
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
}
