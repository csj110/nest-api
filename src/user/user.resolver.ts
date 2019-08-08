import { Resolver, Query, Args, ResolveProperty, Parent } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CommentService } from "src/comment/comment.service";

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService, private commentService: CommentService) { }
  @Query()
  async users(@Args('page') page: number) {
    return await this.userService.showAll(page)
  }

  @ResolveProperty()
  comments(@Parent() user, @Args('page') page: number) {
    const { id } = user
    return this.commentService.showByUser(id, page)
  }
}
