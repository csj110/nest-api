import { Resolver, Query, Args, ResolveProperty, Parent, Mutation, Context } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { CommentService } from "src/comment/comment.service";
import { UseGuards, Logger } from "@nestjs/common";
import { AuthGuard } from "src/shared/auth.guard";
import { User } from "./user.decorator";

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService, private commentService: CommentService) { }
  @Query()
  async users(@Args('page') page: number) {
    return await this.userService.showAll(page)
  }

  @Query()
  user(@Args('username') username: string) {
    return this.userService.read(username)
  }

  @Query()
  @UseGuards(new AuthGuard())
  whoami(@Context('user') { username }) {
    return this.userService.read(username)
  }

  @ResolveProperty()
  comments(@Parent() user, @Args('page') page: number) {
    const { id } = user
    return this.commentService.showByUser(id, page)
  }

  @Mutation()
  async login(@Args('username') username: string, @Args('password') password: string) {
    const res = await this.userService.login({ username, password })
    return {
      username: res.username,
      token: res.token
    }
  }

  @Mutation()
  async register(@Args('username') username: string, @Args('password') password: string) {
    const res = await this.userService.register({ username, password })
    return {
      username: res.username,
      token: res.token
    }
  }
}
