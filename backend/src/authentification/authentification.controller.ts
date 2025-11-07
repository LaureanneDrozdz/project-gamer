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
    console.log('Set-Cookie:', result.accessToken);
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
    const result = await this.authentificationService.signIn(data);
    const payload = this.authentificationService.decodeToken(
      result.accessToken,
    );
    if (!payload || payload.role !== 'ADMIN') {
      throw new UnauthorizedException('Admin credentials required');
    }
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
  // Route handler: inject the request using @Req so `cookies` is defined
  decodeToken(@Req() req: Request) {
    // If called as a route, expect cookies to exist on the request
    const token = req?.cookies?.token as string | undefined;
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    return this.authentificationService.decodeToken(token);
  }
}
