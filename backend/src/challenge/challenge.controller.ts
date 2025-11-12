import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JwtAuthGuard } from '../auth-guard/jwt-auth.guard';
import { ChallengeOwnershipGuard } from './challenge-ownership.guard';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ChallengeEntity } from './entities/challenge.entity';

@ApiTags('Challenge')
@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @Post()
  @ApiBody({ type: CreateChallengeDto })
  @ApiCreatedResponse({ description: 'Challenge créé', type: ChallengeEntity })
  @UseGuards(JwtAuthGuard)
  create(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challengeService.create({ ...createChallengeDto });
  }

  @Get()
  @ApiOkResponse({
    description: 'Liste des challenges',
    type: [ChallengeEntity],
  })
  findAll() {
    return this.challengeService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID du challenge' })
  @ApiOkResponse({ description: 'Challenge trouvé', type: ChallengeEntity })
  findOne(@Param('id') id: string) {
    return this.challengeService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID du challenge' })
  @ApiBody({ type: UpdateChallengeDto })
  @ApiOkResponse({ description: 'Challenge mis à jour', type: ChallengeEntity })
  @UseGuards(JwtAuthGuard, ChallengeOwnershipGuard)
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.challengeService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID du challenge' })
  @ApiOkResponse({ description: 'Challenge supprimé', type: ChallengeEntity })
  @UseGuards(JwtAuthGuard, ChallengeOwnershipGuard)
  remove(@Param('id') id: string) {
    return this.challengeService.remove(id);
  }

  @Patch('validate/:id')
  @ApiParam({ name: 'id', description: 'ID du challenge' })
  @ApiBody({ schema: { properties: { validated: { type: 'boolean' } } } })
  @ApiOkResponse({
    description: 'Challenge validation status updated',
    type: ChallengeEntity,
  })
  @UseGuards(JwtAuthGuard, ChallengeOwnershipGuard)
  async setChallengeValidated(
    @Param('id') id: string,
    @Body() body: { validated: boolean },
  ) {
    const { validated } = body;
    return this.challengeService.validateChallenge(id, validated);
  }
}
