import { IsString } from 'class-validator';
import { UserEntity } from 'src/user/user.entity';
import { UserRO } from 'src/user/user.dto';

export class IdeaDTO {
  @IsString()
  idea: string;
  @IsString()
  desc: string;
}

export class IdeaRO {
  id?: string;
  idea: string;
  desc: string;
  created: Date;
  updated: Date;
  author: UserRO;
}
