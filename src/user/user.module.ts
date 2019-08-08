import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IdeaEntity } from 'src/idea/idea.entity';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, IdeaEntity])],
  controllers: [UserController],
  providers: [UserService, UserResolver],
})
export class UserModule { }
