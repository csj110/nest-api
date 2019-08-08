import { HttpErrorFilter } from './shared/http-error.filter';
import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeaModule } from './idea/idea.module';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [GraphQLModule.forRoot({
    typePaths: ['./**/*.graphql'],
    context: ({ req }) => ({ headers: req.headers })
  }),
  TypeOrmModule.forRoot(), IdeaModule, UserModule, CommentModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
  ],
})
export class AppModule { }
