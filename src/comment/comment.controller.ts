import { Controller, Get, Post, Delete, Param, UseGuards, UsePipes, ValidationPipe, Body, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { CommentDTO } from './comment.dto';

@Controller('api/comment')
export class CommentController {
  constructor(private commentService: CommentService) {
  }

  @Get('idea/:id')
  async showCommetsByIdea(@Param('id') idea: string, @Query('page') page: number) {
    return await this.commentService.showByIdea(idea, page)
  }

  @Get('user/:id')
  async showCommetsByUser(@Param('id') user: string, @Query('page') page: number) {
    return await this.commentService.showByUser(user, page)
  }

  @Get('user')
  @UseGuards(new AuthGuard())
  async showCommetsByOwner(@User('id') user: string) {
    return await this.commentService.showByUser(user)
  }

  @Get(':id')
  async showComment(@Param('id') id: string) {
    return await this.commentService.show(id)
  }

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  async addComment(@Param('id') idea: string, @User('id') user: string, @Body() data: CommentDTO) {
    return await this.commentService.create(idea, user, data)
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async detroyCommment(@Param('id') id: string, @User('id') user: string) {
    return await this.commentService.destroy(id, user)
  }
}
