import { AuthGuard } from 'src/shared/auth.guard'
import { CommentService } from 'src/comment/comment.service'
import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

@Resolver('comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  comment(@Args('id') id: string) {
    return this.commentService.show(id)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async createComment(
    @Args('idea') ideaId: string,
    @Args('comment') comment: string,
    @Context('user') user,
  ) {
    const { id: userId } = user
    const data = { comment }
    return await this.commentService.create(ideaId, userId, data)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async deleteComment(@Args('id') id: string, @Context('user') user) {
    const { id: userId } = user
    return await this.commentService.destroy(id, userId)
  }
}
