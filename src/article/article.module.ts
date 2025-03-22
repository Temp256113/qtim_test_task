import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ArticleController } from './article.controller';
import { CreateArticleUsecase } from './usecases/create-article.usecase';
import { GetArticlesUsecase } from './usecases/get-articles.usecase';
import { ArticleRepository } from './repositories/article.repository';
import { ArticleQueryRepository } from './repositories/article.query-repository';
import { UpdateArticleUsecase } from './usecases/update-article.usecase';
import { DeleteArticleUsecase } from './usecases/delete-article.usecase';
import { ArticleCacheRepository } from './repositories/article.cache-repository';

const usecases = [
  CreateArticleUsecase,
  GetArticlesUsecase,
  UpdateArticleUsecase,
  DeleteArticleUsecase,
];

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), CqrsModule],
  providers: [
    ArticleRepository,
    ArticleQueryRepository,
    ArticleCacheRepository,
    ...usecases,
  ],
  controllers: [ArticleController],
})
export class ArticleModule {}
