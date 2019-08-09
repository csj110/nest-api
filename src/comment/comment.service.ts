import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommentEntity } from './comment.entity'
import { Repository } from 'typeorm'
import { UserEntity } from 'src/user/user.entity'
import { IdeaEntity } from 'src/idea/idea.entity'
import { CommentDTO } from './comment.dto'

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

  private toResoponseObject(comment: CommentEntity) {
    comment.author = comment.author.toResponseObject()
    return comment
  }

  async show(id: string) {
    const res = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea'],
    })
    if (!res) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND)
    }
    return this.toResoponseObject(res)
  }

  async showByIdea(id: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { idea: { id } },
      relations: ['author'],
      take: 8,
      skip: 8 * (page - 1),
    })
    return comments.map(comment => this.toResoponseObject(comment))
  }

  async showByUser(id: string, page: number = 1) {
    const comments = await this.commentRepository.find({
      where: { author: { id } },
      relations: ['author'],
      take: 8,
      skip: 8 * (page - 1),
    })
    return comments.map(comment => this.toResoponseObject(comment))
  }

  async create(ideaId: string, userId: string, data: CommentDTO) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } })
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user || !idea) {
      throw new HttpException('user or idea not found', HttpStatus.BAD_REQUEST)
    }
    const comment: CommentEntity = await this.commentRepository.create({
      ...data,
      idea,
      author: user,
    })
    await this.commentRepository.save(comment)
    comment.author = comment.author.toResponseObject()
    return comment
  }

  async destroy(id: string, userid: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'idea'],
    })
    if (!comment) {
      throw new HttpException('no such comment', HttpStatus.BAD_REQUEST)
    }
    if (userid !== comment.author.id) {
      throw new HttpException('no auth to del', HttpStatus.UNAUTHORIZED)
    }
    await this.commentRepository.remove(comment)
    comment.author = comment.author.toResponseObject()
    return comment
  }
}
