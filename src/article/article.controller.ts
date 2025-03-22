import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateArticleDto } from './dtos/create-article.dto';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { UserFromRequest } from '../utils/decorators/user-from-request.decorator';
import { UserEntity } from '../user/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ArticleSchema } from './dtos/article.schema';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateArticleCommand } from './usecases/create-article.usecase';
import { GetArticlesDto } from './dtos/get-articles.dto';
import { GetArticlesSchema } from './dtos/get-articles.schema';
import { GetArticlesQuery } from './usecases/get-articles.usecase';
import { UpdateArticleDto } from './dtos/update-article.dto';
import {
  cantEditArticleErrDesc,
  notFoundArticleByIdErrDesc,
} from './constants';
import { UpdateArticleCommand } from './usecases/update-article.usecase';

@Controller('/article')
@ApiTags('article')
export class ArticleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new article' })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Article was successful created',
    type: ArticleSchema,
  })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  async createArticle(
    @Body() dto: CreateArticleDto,
    @UserFromRequest() user: UserEntity,
  ): Promise<ArticleSchema> {
    return this.commandBus.execute(
      new CreateArticleCommand({
        ...dto,
        authorId: user.id,
      }),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get articles' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: GetArticlesSchema,
  })
  async getArticles(@Query() dto: GetArticlesDto): Promise<GetArticlesSchema> {
    return this.queryBus.execute(new GetArticlesQuery(dto));
  }

  @Patch('/:articleId')
  @ApiOperation({ summary: 'Update article' })
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Article was successful updated',
    type: ArticleSchema,
  })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse({
    description: notFoundArticleByIdErrDesc,
  })
  @ApiForbiddenResponse({
    description: cantEditArticleErrDesc,
  })
  async updateArticle(
    @Param('articleId') articleId: number,
    @Body() dto: UpdateArticleDto,
    @UserFromRequest() user: UserEntity,
  ) {
    return this.commandBus.execute(
      new UpdateArticleCommand(articleId, user.id, dto),
    );
  }
}
