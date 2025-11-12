import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthentificationService } from './authentification.service';
import { UserService } from '../user/user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Request } from 'express';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthentificationController {
  constructor(
    private authentificationService: AuthentificationService,
    private usersService: UserService,
  ) {}

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
    type: SignUpDto,
  })
  @ApiOkResponse({
    description: 'Registration successful, sets access token cookie',
  })
  async signUp(
    @Body() data: SignUpDto,
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

  @HttpCode(HttpStatus.OK)
  @Post('admin-login')
  @ApiBody({
    type: SignInDto,
  })
  @ApiOkResponse({
    description: 'Admin login successful, sets admin_token cookie',
  })
  async adminSignIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res?: Response,
  ) {
    const result = await this.authentificationService.signInAdmin(data);
    if (res && result?.accessToken) {
      res.cookie('admin_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return { ok: true };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Returns the decoded payload of the JWT',
    type: 'object',
  })
  async decodeToken(@Req() req: Request) {
    const token = req?.cookies?.token as string | undefined;
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    // Decode the token to get the user id, then fetch the full user profile
    const payload = this.authentificationService.decodeToken(token);
    // If payload doesn't contain an id, unauthorize
    if (!payload?.id) {
      throw new UnauthorizedException('Authentication required');
    }
    // Use UserService to fetch the user entity and return it directly
    const user = await this.usersService.findOne(payload.id);
    return user;
  }

  @Get('profile-admin')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Returns the decoded payload of the JWT',
    type: 'object',
  })
  async decodeTokenAdmin(@Req() req: Request) {
    const token = req?.cookies?.admin_token as string | undefined;
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    // Decode the token to get the user id, then fetch the full user profile
    const payload = this.authentificationService.decodeToken(token);
    // If payload doesn't contain an id, unauthorize
    if (!payload?.id) {
      throw new UnauthorizedException('Authentication required');
    }
    // Use UserService to fetch the user entity and return it directly
    const user = await this.usersService.findOne(payload.id);
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    res.clearCookie('admin_token');
    return { message: 'Déconnexion réussie' };
  }
}
