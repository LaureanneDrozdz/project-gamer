import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { JwtAuthGuard } from '../auth-guard/jwt-auth.guard';
import { VoteOwnershipGuard } from './vote-ownership.guard';
import { CheckVoteDto } from './dto/check-vote.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { VoteEntity } from './entities/vote.entity';

@ApiTags('Votes')
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Get('target/:id')
  @ApiParam({
    name: 'id',
    description: 'ID de la cible (challenge ou participation)',
  })
  @ApiResponse({
    description: 'Liste des votes pour la cible spécifiée',
    type: [VoteEntity],
  })
  findByTargetId(@Param('id') id: string) {
    return this.voteService.findByTargetId(id);
  }

  @Post('check')
  @ApiBody({ type: CheckVoteDto })
  @ApiOkResponse({
    description:
      "Renvoie true si l'utilisateur a déjà voté pour la cible, sinon false",
  })
  async checkIfVoted(@Body() checkVoteDto: CheckVoteDto) {
    const hasVoted = await this.voteService.hasVoted(checkVoteDto);
    return hasVoted;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateVoteDto })
  @ApiResponse({ description: 'Crée un nouveau vote', type: VoteEntity })
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.voteService.create(createVoteDto);
  }

  @Get()
  @ApiResponse({ description: 'Liste de tous les votes', type: [VoteEntity] })
  findAll() {
    return this.voteService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID du vote' })
  @ApiResponse({ description: 'Détail du vote', type: VoteEntity })
  findOne(@Param('id') id: string) {
    return this.voteService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, VoteOwnershipGuard)
  @ApiParam({ name: 'id', description: 'ID du vote à mettre à jour' })
  @ApiBody({ type: UpdateVoteDto })
  @ApiResponse({ description: 'Vote mis à jour', type: VoteEntity })
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.voteService.update(id, updateVoteDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, VoteOwnershipGuard)
  @ApiParam({ name: 'id', description: 'ID du vote à supprimer' })
  @ApiResponse({ description: 'Vote supprimé', type: VoteEntity })
  remove(@Param('id') id: string) {
    return this.voteService.remove(id);
  }
}
