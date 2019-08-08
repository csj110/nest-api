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

  private toResoponseObkject(comment: CommentEntity) {
    return comment.author = comment.author.toResponseObject()
  }

  async show(id: string) {
    const res = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'idea'] })

    return this.toResoponseObkject(res)
  }

  async showByIdea(id: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { idea: { id } }, relations: ['author'], take: 8,
      skip: 8 * (page - 1)
    })
    return comments.map(comment => (this.toResoponseObkject(comment)))
  }

  async showByUser(id: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { author: { id } }, relations: ['author'], take: 8,
      skip: 8 * (page - 1)
    })
    return comments.map(comment => (this.toResoponseObkject(comment)))
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
