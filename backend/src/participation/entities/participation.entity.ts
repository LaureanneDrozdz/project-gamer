import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Vote } from 'src/vote/entities/vote.entity';

export class Participation {
  @ApiProperty({
    description: 'Identifiant unique de la participation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: "Identifiant de l'utilisateur participant",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  users_id: string;

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
  created_at: Date;

  @ApiProperty({
    description: "L'utilisateur qui a créé la participation",
    type: User,
  })
  user?: User;

  @ApiProperty({
    description: 'Votes reçus pour cette participation',
    type: [Vote],
  })
  votes?: Vote[];
}
