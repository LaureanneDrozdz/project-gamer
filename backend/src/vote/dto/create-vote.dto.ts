import { ApiProperty } from '@nestjs/swagger';
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
}
