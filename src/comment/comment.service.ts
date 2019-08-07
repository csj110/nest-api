import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comment.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { IdeaEntity } from 'src/idea/idea.entity';
import { CommentDTO } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  async show(id: string) {
    return await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] })
  }

  async showByIdea(id: string) {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['comments', 'comment.idea', 'comment.author'] })
    return idea.comments
  }

  async showByUser(id: string) {
    const comments = await this.commentRepository.find({ where: { author: { id } } })
    return comments
  }

  async create(ideaId: string, userId: string, data: CommentDTO) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } })
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const comment: CommentEntity = await this.commentRepository.create({
      ...data,
      idea,
      author: user
    })
    await this.commentRepository.save(comment)
    comment.author = comment.author.toResponseObject()
    return {
      message: 'create success',
      comment
    };
  }

  async destroy(id: string, userid: string) {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] });
    if (userid !== comment.author.id) {
      throw new HttpException('no auth to del', HttpStatus.UNAUTHORIZED)
    }
    await this.commentRepository.remove(comment)
    comment.author = comment.author.toResponseObject()
    return {
      message: 'del success',
      comment
    }
  }
}

