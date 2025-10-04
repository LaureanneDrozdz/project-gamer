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
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { JwtAuthGuard } from '../auth-guard/jwt-auth.guard';
import { ParticipationOwnershipGuard } from './participation-ownership.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiParam, ApiOperation } from '@nestjs/swagger';
import { ParticipationEntity } from './entities/participation.entity';

@ApiTags('Participation')
@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post()
  @ApiBody({ type: CreateParticipationDto })
  @ApiCreatedResponse({ description: 'Participation créée', type: ParticipationEntity })
  @UseGuards(JwtAuthGuard)
  create(@Body() createParticipationDto: CreateParticipationDto, @Req() req) {
    return this.participationService.create({
      ...createParticipationDto,
      user_id: req.user.id,
    });
  }

  @Get()
  @ApiOkResponse({ description: 'Liste des participations', type: [ParticipationEntity] })
  findAll() {
    return this.participationService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'ID de la participation' })
  @ApiOkResponse({ description: 'Participation trouvée', type: ParticipationEntity })
  findOne(@Param('id') id: string) {
    return this.participationService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'ID de la participation' })
  @ApiBody({ type: UpdateParticipationDto })
  @ApiOkResponse({ description: 'Participation mise à jour', type: ParticipationEntity })
  @UseGuards(JwtAuthGuard, ParticipationOwnershipGuard)
  update(
    @Param('id') id: string,
    @Body() updateParticipationDto: UpdateParticipationDto,
  ) {
    return this.participationService.update(id, updateParticipationDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'ID de la participation' })
  @ApiOkResponse({ description: 'Participation supprimée', type: ParticipationEntity })
  @UseGuards(JwtAuthGuard, ParticipationOwnershipGuard)
  remove(@Param('id') id: string) {
    return this.participationService.remove(id);
  }
}
