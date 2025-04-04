import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './usecases/register-user.usecase';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';
import { LoginUserSchema } from './dtos/login-user.schema';
import {
  LoginUserCommand,
  unauthorizedExceptionDesc,
} from './usecases/login-user.usecase';
import {
  ITokensPairSchema,
  JwtTokensService,
} from '../utils/jwt-tokens/jwt-tokens.service';
import { Response } from 'express';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { UserFromRequest } from '../utils/decorators/user-from-request.decorator';
import { UserEntity } from './user.entity';

@Controller('user')
@ApiTags('user')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtTokensService: JwtTokensService,
  ) {}

  @Post('auth/register')
  @ApiOperation({ summary: 'User register' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Success registration',
  })
  @ApiConflictResponse({
    description: 'Username already taken',
  })
  async register(@Body() dto: RegisterUserDto) {
    await this.commandBus.execute(new RegisterUserCommand(dto));
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'User login' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Success login',
    type: LoginUserSchema,
  })
  @ApiUnauthorizedResponse({
    description: unauthorizedExceptionDesc,
  })
  async login(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserSchema> {
    const tokensPair: ITokensPairSchema = await this.commandBus.execute(
      new LoginUserCommand(dto),
    );

    this.jwtTokensService.setRefreshTokenInCookie({
      refreshToken: tokensPair.refreshToken,
      res,
    });

    return {
      accessToken: tokensPair.accessToken,
    };
  }

  @Put('update-tokens-pair')
  @ApiOperation({ summary: 'Update tokens pair' })
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The tokens pair successfully updated',
    type: LoginUserSchema,
  })
  @ApiUnauthorizedResponse()
  @ApiCookieAuth()
  async updateTokensPair(
    @UserFromRequest() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginUserSchema> {
    const newTokensPair: ITokensPairSchema =
      await this.jwtTokensService.createTokensPair({
        userId: user.id,
        username: user.username,
      });

    this.jwtTokensService.setRefreshTokenInCookie({
      refreshToken: newTokensPair.refreshToken,
      res,
    });

    return {
      accessToken: newTokensPair.accessToken,
    };
  }
}
