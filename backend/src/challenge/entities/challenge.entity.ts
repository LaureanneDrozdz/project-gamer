import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { VoteEntity } from '../../vote/entities/vote.entity';
import { Challenge, Difficulty } from '@prisma/client';

export class ChallengeEntity {
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
  user_id: string;

  @ApiProperty({
    description: 'Image de couverture du challenge',
    example: 'https://via.assets.so/game.webp?id=99',
  })
  image_url: string | null;

  @ApiProperty({
    description: 'Statut de validation du challenge',
    example: true,
  })
  validated: boolean;

  @ApiProperty({
    description: 'Date de création du challenge',
    example: '2025-05-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: "L'utilisateur qui a créé le challenge",
    // Use a lazy resolver to avoid circular reference during Swagger model generation
    type: () => UserEntity,
  })
  creator?: UserEntity;

  @ApiProperty({
    description: 'Votes reçus pour ce challenge',
    // Use lazy resolver + isArray to avoid circular references
    type: () => VoteEntity,
    isArray: true,
  })
  votes?: VoteEntity[];
  constructor(challenge: Challenge) {
    Object.assign(this, challenge);
    // Ensure created_at is serialized as ISO string
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.created_at =
      challenge.created_at instanceof Date
        ? challenge.created_at.toISOString()
        : (challenge.created_at as unknown as string);
  }
}
