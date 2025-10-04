
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOkResponse, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get('leaderboard')
  @ApiQuery({ name: 'limit', required: false, description: 'Nombre maximum de résultats à retourner' })
  @ApiResponse({ description: 'Classement des meilleurs utilisateurs', type: [UserEntity] })
  leaderboard(@Query('limit') limit?: string) {
    const top = limit ? parseInt(limit) : 10;
    return this.userService.getLeaderboard(top);
  }


  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ description: 'Utilisateur créé', type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    const userCreateInput = {
      ...createUserDto,
      password_hash: createUserDto.password,
    };
    return this.userService.create(userCreateInput);
  }


  @Get()
  @ApiResponse({ description: 'Liste de tous les utilisateurs', type: [UserEntity] })
  findAll() {
    return this.userService.findAll();
  }


  @Get(':id')
  @ApiParam({ name: 'id', description: "ID de l'utilisateur" })
  @ApiOkResponse({ description: 'Détail de l\'utilisateur', type: UserEntity })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


  @Patch(':id')
  @ApiParam({ name: 'id', description: "ID de l'utilisateur à mettre à jour" })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'Utilisateur mis à jour', type: UserEntity })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  @Delete(':id')
  @ApiParam({ name: 'id', description: "ID de l'utilisateur à supprimer" })
  @ApiOkResponse({ description: 'Utilisateur supprimé', type: UserEntity })
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
