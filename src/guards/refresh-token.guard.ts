import {
  IJwtTokenPayload,
  JwtTokensService,
  TokensTypes,
} from '../utils/jwt-tokens/jwt-tokens.service';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserQueryRepository } from '../user/repositories/user.query-repository';
import { UserEntity } from '../user/user.entity';
import { BaseTokenGuard, IRequestWithUser } from './base-token.guard';

@Injectable()
export class RefreshTokenGuard extends BaseTokenGuard implements CanActivate {
  constructor(
    protected readonly tokensService: JwtTokensService,
    protected readonly userQueryRepository: UserQueryRepository,
  ) {
    super(tokensService, userQueryRepository);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: IRequestWithUser = context.switchToHttp().getRequest();

    const refreshToken: string =
      req.cookies?.[JwtTokensService.refreshTokenCookieTitle];

    await this.verifyTokenAndAddUserToRequest(req, {
      token: refreshToken,
      tokenType: TokensTypes.REFRESH_TOKEN,
    });

    return true;
  }
}
