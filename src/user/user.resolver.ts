import { Resolver, Query } from "@nestjs/graphql";

@Resolver('')
export class UserResolver {
  @Query()
  users() {
    return [{
      id: 'id',
      username: "username"
    }]
  }
}