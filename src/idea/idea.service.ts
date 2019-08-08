import { UserRO } from './../user/user.dto'
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Repository } from 'typeorm'
import { IdeaEntity } from './idea.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { IdeaDTO, IdeaRO } from './idea.dto'
import { UserEntity } from 'src/user/user.entity'
import { Votes } from 'src/shared/votes.enum';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  private toResposeObject(idea: IdeaEntity): IdeaRO {
    const res: any = { ...idea, author: idea.author.toResponseObject() }
    if (res.upvotes) {
      res.upvotes = res.upvotes.length
    }
    if (res.downvotes) {
      res.downvotes = res.downvotes.length
    }
    return res
  }

  private ensureOwnerShip(idea: IdeaEntity, userid: string) {
    if (idea.author.id !== userid) {
      throw new HttpException('action is forbidden', HttpStatus.UNAUTHORIZED)
    }
  }

  private async  vote(idea: IdeaEntity, user: UserEntity, vote: Votes): Promise<IdeaRO> {
    const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
    if (
      idea[opposite].find(voter => voter.id === user.id) ||
      idea[vote].find(voter => voter.id === user.id)
    ) {
      idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
      idea[vote] = idea[vote].filter(voter => voter.id !== user.id)
      await this.ideaRepository.save(idea);
      return this.toResposeObject(idea)
    } else {
      idea[vote].push(user)
      await this.ideaRepository.save(idea)
      return this.toResposeObject(idea)
    }
  }

  async showAllOrder(page: number = 1, order: boolean = false): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes', "comments"],
      take: 8,
      skip: 8 * (page - 1),
      order: order && {
        created: "DESC"
      }
    })
    Logger.log(ideas)
    return ideas.map(idea => this.toResposeObject(idea))
  }

  async create(data: IdeaDTO, userId: string): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const idea = await this.ideaRepository.create({ ...data, author: user })
    await this.ideaRepository.save(idea)
    return this.toResposeObject({ ...idea, author: user })
  }

  async read(id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
    })
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    return this.toResposeObject(idea)
  }

  async update(
    id: string,
    data: Partial<IdeaDTO>,
    userId: string,
  ): Promise<IdeaRO> {
    let idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    })
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    this.ensureOwnerShip(idea, userId)
    await this.ideaRepository.update({ id }, data)
    idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
    })
    return this.toResposeObject(idea)
  }

  async destory(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: ['author'],
    })
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    this.ensureOwnerShip(idea, userId)
    await this.ideaRepository.delete({ id })
    return this.toResposeObject(idea)
  }

  async bookmark(id: string, userId: string): Promise<UserRO> {
    const idea = await this.ideaRepository.findOne({ where: { id } })
    if (!idea) {
      throw new HttpException('not found idea', HttpStatus.BAD_REQUEST)
    }
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] })
    user.bookmarks = [...user.bookmarks, idea]
    await this.userRepository.save(user);
    Logger.log(user)
    return user.toResponseObject()
  }

  async unbookmark(id: string, userId: string): Promise<UserRO> {
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['bookmarks'] })
    user.bookmarks = user.bookmarks.filter(item => item.id !== id)
    await this.userRepository.save(user);
    return user.toResponseObject()
  }

  async dealVote(id: string, userId: string, vote: Votes): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author', 'upvotes', 'downvotes', 'comment'] })
    const user = await this.userRepository.findOne({ id: userId })
    return await this.vote(idea, user, vote)
  }
}
