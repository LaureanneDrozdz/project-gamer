import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { AuthentificationService } from "./authentification.service";
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiResponse } from "@nestjs/swagger";
import { Response } from 'express';
import { Request } from "express";

@Controller('auth')
export class AuthentificationController {
  constructor(private authentificationService: AuthentificationService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({
    type: SignInDto
  })
  @ApiOkResponse({
    description: 'Login successful, sets access token cookie'
  })
  async signIn(@Body() data: SignInDto, @Res({ passthrough: true }) res: Response ) {
    const { accessToken } = await this.authentificationService.signIn(data);
    res.cookie('token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
    return { success: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiBody({
    type: CreateUserDto
  })
  @ApiOkResponse({
    description: 'Registration successful, sets access token cookie',
  })
  async signUp(@Body() data: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken } = await this.authentificationService.signUp(data);
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { success: true };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Returns the decoded payload of the JWT',
    type: 'object'
  })
  decodeToken(@Req() req: Request) {
    const token = req.cookies?.token;
    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }
    return this.authentificationService.decodeToken(token);
  }

}