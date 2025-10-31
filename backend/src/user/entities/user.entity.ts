import { ApiProperty } from '@nestjs/swagger';
import { ChallengeEntity } from '../../challenge/entities/challenge.entity';
import { ParticipationEntity } from '../../participation/entities/participation.entity';
import { Roles, User } from '@prisma/client';
import { VoteEntity } from '../../vote/entities/vote.entity';

export class UserEntity {
  constructor(user: Partial<User>) {
    Object.assign(this, user);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete this.password_hash;

    // Normalize created_at to ISO string for API consumers
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.created_at = user?.created_at instanceof Date
      ? user.created_at.toISOString()
      : (user?.created_at as unknown as string);
  }

  @ApiProperty({
    description: "Identifiant unique de l'utilisateur",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: "Nom d'utilisateur unique",
    example: 'johndoe',
  })
  userName: string;

  @ApiProperty({
    description: "Adresse email unique de l'utilisateur",
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: "Mot de passe haché de l'utilisateur",
    example: '$2b$10$abcdefghijklmnopqrstuvwxyz123456789',
  })
  password_hash: string;

  @ApiProperty({
    description: "URL de l'avatar de l'utilisateur",
    example: 'https://example.com/avatars/johndoe.png',
  })
  avatar_url: string;

  @ApiProperty({
    description: 'Date de création du compte',
    example: '2025-05-15T10:30:00Z',
  })
  created_at: string;

  @ApiProperty({
    description: "Challenges créés par l'utilisateur",
    // Lazy resolver + isArray to prevent circular reference issues in Swagger
    type: () => ChallengeEntity,
    isArray: true,
  })
  challenges?: ChallengeEntity[];

  @ApiProperty({
    description: "Participations de l'utilisateur",
    type: () => ParticipationEntity,
    isArray: true,
  })
  participations?: ParticipationEntity[];

  @ApiProperty({
    description: "Votes de l'utilisateur",
    type: () => VoteEntity,
    isArray: true,
  })
  votes?: VoteEntity[];

  @ApiProperty({
    description: "Rôle(s) de l'utilisateur (par exemple, 'admin', 'user')",
    enum: Roles,
    example: 'user',
  })
  role: Roles;
}
