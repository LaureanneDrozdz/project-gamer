import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { TargetType } from '@prisma/client';
import { Trim } from 'class-sanitizer';
import { ApiProperty } from '@nestjs/swagger';

export class CheckVoteDto {
  @ApiProperty({
    description: "ID of the user casting the vote",
    example: 'a4a52400-22b7-4318-b04d-3dc5a75c63f4',
  })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
  @ApiProperty({
    description: "ID of the vote target (challenge or participation)",
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  target_id: string;

  @ApiProperty({
    description: 'Type of the target (CHALLENGE or PARTICIPATION)',
    enum: TargetType,
    example: 'CHALLENGE',
  })
  @IsEnum(TargetType)
  @IsNotEmpty()
  target_type: TargetType;
}