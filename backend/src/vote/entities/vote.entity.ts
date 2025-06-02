import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { Challenge } from '../../challenge/entities/challenge.entity';
import { Participation } from '../../participation/entities/participation.entity';

export enum TargetType {
  CHALLENGE = 'CHALLENGE',
  PARTICIPATION = 'PARTICIPATION',
}

export class Vote {
  @ApiProperty({
    description: 'Identifiant unique du vote',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: "Identifiant de l'utilisateur votant",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  users_id: string;

  @ApiProperty({
    description: 'Identifiant de la cible du vote (challenge ou participation)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  target_id: string;

  @ApiProperty({
    description: 'Type de la cible (CHALLENGE ou PARTICIPATION)',
    enum: TargetType,
    example: 'CHALLENGE',
  })
  target_type: TargetType;

  @ApiProperty({
    description: 'Date de création du vote',
    example: '2025-05-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: "L'utilisateur qui a voté",
    type: User,
  })
  user?: User;

  @ApiProperty({
    description: 'Le challenge ciblé (si target_type est CHALLENGE)',
    type: Challenge,
    nullable: true,
  })
  challenge?: Challenge | null;

  @ApiProperty({
    description: 'La participation ciblée (si target_type est PARTICIPATION)',
    type: Participation,
    nullable: true,
  })
  participation?: Participation | null;
}
