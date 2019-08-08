import { IsString } from 'class-validator'
import { callbackify } from 'util'

export class CommentDTO {
  @IsString()
  comment: string
}

