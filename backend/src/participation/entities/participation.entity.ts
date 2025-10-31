import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { VoteEntity } from '../../vote/entities/vote.entity';
import { Participation } from '@prisma/client';

export class ParticipationEntity {
  @ApiProperty({
    description: 'Identifiant unique de la participation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: "Identifiant de l'utilisateur participant",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({
    description: 'Identifiant du challenge concerné',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  challenge_id: string;

  @ApiProperty({
    description: 'URL de la vidéo prouvant la réalisation',
    example: 'https://example.com/videos/my-challenge-completion.mp4',
  })
  video_url: string;

  @ApiProperty({
    description: 'Description détaillée de la participation',
    example:
      "J'ai réussi ce challenge en utilisant une stratégie spécifique...",
  })
  description: string;

  @ApiProperty({
    description: 'Statut de validation de la participation',
    example: true,
  })
  validated: boolean;

  @ApiProperty({
    description: 'Date de création de la participation',
    example: '2025-05-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: "L'utilisateur qui a créé la participation",
    type: () => UserEntity,
  })
  user?: UserEntity;

  @ApiProperty({
    description: 'Votes reçus pour cette participation',
    type: () => VoteEntity,
    isArray: true,
  })
  votes?: VoteEntity[];

  constructor(participation: Participation) {
    Object.assign(this, participation);
    // Ensure created_at is serialized as ISO string for the API
    // Prisma may return a Date object; convert to ISO string for consistency
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.created_at = participation.created_at instanceof Date
      ? participation.created_at.toISOString()
      : (participation.created_at as unknown as string);
  }
}
