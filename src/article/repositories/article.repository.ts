import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { ArticleQueryRepository } from './article.query-repository';
import { ArticleSchema } from '../dtos/article.schema';
import { UpdateArticleDto } from '../dtos/update-article.dto';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articlesRepository: Repository<ArticleEntity>,
    private readonly articlesQueryRepository: ArticleQueryRepository,
  ) {}

  async createArticle(
    dto: CreateArticleDto & { authorId: number },
  ): Promise<ArticleSchema> {
    const articleInsertResult = await this.articlesRepository.insert({
      title: dto.title,
      description: dto.description,
      authorId: dto.authorId,
      publishedAt: new Date().toISOString(),
    });

    const createdArticleId: number = articleInsertResult.identifiers[0].id;

    return this.articlesQueryRepository.getArticleById(
      createdArticleId,
    ) as any as ArticleSchema;
  }

  async updateArticle(
    articleId: number,
    dto: UpdateArticleDto,
  ): Promise<ArticleSchema> {
    await this.articlesRepository.update(articleId, dto);

    return this.articlesQueryRepository.getArticleById(
      articleId,
    ) as any as ArticleSchema;
  }

  async deleteArticle(articleId: number) {
    await this.articlesRepository.delete(articleId);
  }
}
