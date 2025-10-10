import { ApiProperty } from '@nestjs/swagger';
import { Escape } from 'class-sanitizer';
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  IsUUID,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateParticipationDto {
  @ApiProperty({
    description: 'ID du challenge auquel cette participation est liée',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  challenge_id: string;
  @ApiProperty({
    description: 'URL de la vidéo prouvant la réalisation du challenge',
    example: 'https://example.com/videos/my-challenge-completion.mp4',
  })
  @IsUrl()
  @IsNotEmpty()
  video_url: string;

  @ApiProperty({
    description: 'Description détaillée de la participation',
    example:
      "J'ai réussi ce challenge en utilisant une stratégie spécifique...",
  })
  @IsString()
  @IsNotEmpty()
  @Escape()
  description: string;

  @ApiProperty({
    description: 'Statut de validation de la participation (par défaut false)',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  validated?: boolean = false;

  @ApiProperty({
    description: 'User qui poste la participation',
    example: 'a4a52400-22b7-4318-b04d-3dc5a75c63f4',
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
