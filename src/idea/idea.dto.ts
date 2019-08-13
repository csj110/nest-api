import { IsString } from 'class-validator'
import { UserRO } from 'src/user/user.dto'

export class IdeaDTO {
  id?: string
  @IsString()
  idea: string
  @IsString()
  desc: string
}

export class IdeaRO {
  id?: string
  idea: string
  desc: string
  created: Date
  updated: Date
  author: UserRO
  upvotes?: number
  downvotes?: number
}
