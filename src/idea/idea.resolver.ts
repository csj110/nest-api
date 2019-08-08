import { Resolver, Query, Args, Parent, ResolveProperty } from "@nestjs/graphql";
import { IdeaService } from "./idea.service";
import { CommentService } from "src/comment/comment.service";

@Resolver('Idea')
export class IdeaResolver {
  constructor(private ideaService: IdeaService, private commentService: CommentService) {
  }

  @Query()
  async ideas(@Args('page') page: number, @Args('newest') newest: boolean) {
    return await this.ideaService.showAllOrder(page, newest)
  }

  @ResolveProperty()
  comments(@Parent() user, @Args('page') page: number) {
    const { id } = user
    return this.commentService.showByUser(id, page)
  }
}
