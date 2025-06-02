import { ApiProperty } from '@nestjs/swagger';
import { Challenge } from 'src/challenge/entities/challenge.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { Vote } from 'src/vote/entities/vote.entity';

export class User {
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
  created_at: Date;

  @ApiProperty({
    description: "Challenges créés par l'utilisateur",
    type: [Challenge],
  })
  challenges?: Challenge[];

  @ApiProperty({
    description: "Participations de l'utilisateur",
    type: [Participation],
  })
  participations?: Participation[];

  @ApiProperty({
    description: "Votes de l'utilisateur",
    type: [Vote],
  })
  votes?: Vote[];
}
