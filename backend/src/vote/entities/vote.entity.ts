import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entities/user.entity';
import { ChallengeEntity } from '../../challenge/entities/challenge.entity';
import { ParticipationEntity } from '../../participation/entities/participation.entity';
import { Vote } from '@prisma/client';
import { TargetType } from '@prisma/client';

export class VoteEntity {
  @ApiProperty({
    description: 'Identifiant unique du vote',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: "Identifiant de l'utilisateur votant",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({ nullable: true })
  challenge_id: string | null;

  @ApiProperty({ nullable: true })
  participation_id: string | null;

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
  created_at: string;

  @ApiProperty({
    description: "L'utilisateur qui a voté",
    type: () => UserEntity,
  })
  user: UserEntity;

  @ApiProperty({
    description: 'Le challenge ciblé (si target_type est CHALLENGE)',
    type: () => ChallengeEntity,
    nullable: true,
  })
  challenge?: ChallengeEntity | null;

  @ApiProperty({
    description: 'La participation ciblée (si target_type est PARTICIPATION)',
    type: () => ParticipationEntity,
    nullable: true,
  })
  participation?: ParticipationEntity | null;

  constructor(vote: Vote) {
    Object.assign(this, vote);
    // normalize created_at
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.created_at =
      vote.created_at instanceof Date
        ? vote.created_at.toISOString()
        : (vote.created_at as unknown as string);
  }
}
