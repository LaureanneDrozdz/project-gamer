import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthentificationService } from './authentification.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Request } from 'express';

@Controller('auth')
export class AuthentificationController {
  constructor(private authentificationService: AuthentificationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    type: SignInDto,
  })
  @ApiOkResponse({
    description: 'Login successful, sets access token cookie',
  })
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const result = await this.authentificationService.signIn(data);
    if (res && result?.accessToken) {
      res.cookie('token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiBody({
    type: CreateUserDto,
  })
  @ApiOkResponse({
    description: 'Registration successful, sets access token cookie',
  })
  async signUp(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const result = await this.authentificationService.signUp(data);
    if (res && result?.accessToken) {
      res.cookie('token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return result;
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Returns the decoded payload of the JWT',
    type: 'object',
  })
  // Accept either the full Request (usual runtime) or a raw token (tests pass a string)
  decodeToken(reqOrToken: Request | string) {
    if (typeof reqOrToken === 'string') {
      const tokenString = reqOrToken.replace(/^Bearer\s*/i, '').trim();
      if (!tokenString)
        throw new UnauthorizedException('Authentication required');
      return this.authentificationService.decodeToken(tokenString);
    }
    const token = reqOrToken.cookies?.token as string | undefined;
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.authentificationService.decodeToken(token);
  }
}
