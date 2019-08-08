import { Votes } from 'src/shared/votes.enum'
import { AuthGuard } from 'src/shared/auth.guard'
import {
  Resolver,
  Query,
  Args,
  Parent,
  ResolveProperty,
  Mutation,
  Context,
} from '@nestjs/graphql'
import { IdeaService } from './idea.service'
import { CommentService } from 'src/comment/comment.service'
import { UseGuards } from '@nestjs/common'
import { IdeaDTO } from './idea.dto'

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query()
  async ideas(@Args('page') page: number, @Args('newest') newest: boolean) {
    return await this.ideaService.showAllOrder(page, newest)
  }

  @Query()
  async idea(@Args('id') id: string) {
    return await this.ideaService.read(id)
  }

  @ResolveProperty()
  async comments(@Parent() user, @Args('page') page: number) {
    const { id } = user
    return await this.commentService.showByUser(id, page)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async createIdea(
    @Context('user') { userId },
    @Args('idea') idea: string,
    @Args('desc') desc: string,
  ) {
    const data: IdeaDTO = { idea, desc }
    return await this.ideaService.create(data, userId)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async updateIdes(
    @Context('user') { userId },
    @Args('id') id: string,
    @Args('idea') idea: string,
    @Args('desc') desc: string,
  ) {
    const data: IdeaDTO = { idea, desc }
    return await this.ideaService.update(id, data, userId)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async deleteIdea(@Context('user') { userId }, @Args('id') id: string) {
    return await this.ideaService.destory(id, userId)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async upvote(@Context('user') { userId }, @Args('id') id: string) {
    return await this.ideaService.dealVote(id, userId, Votes.UP)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async downvotes(@Context('user') { userId }, @Args('id') id: string) {
    return await this.ideaService.dealVote(id, userId, Votes.DOWN)
  }

  @Mutation()
  @UseGuards(new AuthGuard())
  async bookmark(@Context('user') { userId }, @Args('id') id: string) {
    return await this.ideaService.bookmark(id, userId)
  }

  @UseGuards(new AuthGuard())
  async unbookmark(@Context('user') { userId }, @Args('id') id: string) {
    return await this.ideaService.unbookmark(id, userId)
  }
}
