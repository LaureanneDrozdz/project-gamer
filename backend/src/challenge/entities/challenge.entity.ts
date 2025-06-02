import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Vote } from 'src/vote/entities/vote.entity';

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export class Challenge {
  @ApiProperty({
    description: 'Identifiant unique du challenge',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Titre du challenge',
    example: 'Speedrun World 1-1',
  })
  title: string;

  @ApiProperty({
    description: 'Description détaillée du challenge',
    example: 'Terminez le premier niveau du jeu en moins de 30 secondes',
  })
  description: string;

  @ApiProperty({
    description: 'Règles spécifiques à suivre pour le challenge',
    example:
      'Pas de bugs ou glitches autorisés. Le chrono commence dès que le niveau est chargé.',
  })
  rules: string;

  @ApiProperty({
    description: 'Nom du jeu concerné par le challenge',
    example: 'Super Mario Bros',
  })
  game: string;

  @ApiProperty({
    description: 'Niveau de difficulté du challenge',
    enum: Difficulty,
    example: 'MEDIUM',
  })
  difficulty: Difficulty;

  @ApiProperty({
    description: "Identifiant de l'utilisateur créateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  created_by: string;

  @ApiProperty({
    description: 'Statut de validation du challenge',
    example: true,
  })
  validated: boolean;

  @ApiProperty({
    description: 'Date de création du challenge',
    example: '2025-05-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: "L'utilisateur qui a créé le challenge",
    type: User,
  })
  creator?: User;

  @ApiProperty({
    description: 'Votes reçus pour ce challenge',
    type: [Vote],
  })
  votes?: Vote[];
}
