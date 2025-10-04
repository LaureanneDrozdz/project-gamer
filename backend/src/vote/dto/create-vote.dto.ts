import { ApiProperty } from '@nestjs/swagger';
import { Trim } from 'class-sanitizer';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

enum TargetType {
  CHALLENGE = 'CHALLENGE',
  PARTICIPATION = 'PARTICIPATION',
}

export class CreateVoteDto {
  @ApiProperty({
    description: 'ID de la cible du vote (challenge ou participation)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  target_id: string;

  @ApiProperty({
    description: 'Type de la cible (CHALLENGE ou PARTICIPATION)',
    enum: TargetType,
    example: 'CHALLENGE',
  })
  @IsEnum(TargetType)
  @IsNotEmpty()
  target_type: TargetType;

  @ApiProperty({
    description: 'User qui vote pour la participation',
    example:
      "a4a52400-22b7-4318-b04d-3dc5a75c63f4",
  })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}