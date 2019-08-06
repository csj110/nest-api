import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { UserEntity } from 'src/user/user.entity';
import { deserialize } from 'class-transformer';

@Injectable()
export class IdeaService {

  constructor(
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) { }

  private toResposeObject(idea: IdeaEntity) {
    return { ...idea, author: idea.author.toResponseObject() }
  }

  private ensureOwnerShip(idea: IdeaEntity, userid: string, ) {
    if (idea.author.id !== userid) {
      throw new HttpException('action is forbidden', HttpStatus.UNAUTHORIZED)
    }
  }

  async showAll(): Promise<IdeaRO[]> {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });
    return ideas.map(idea => (this.toResposeObject(idea)))
  }

  async create(data: IdeaDTO, userId: string): Promise<IdeaRO> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    const idea = await this.ideaRepository.create({ ...data, author: user });
    await this.ideaRepository.save(idea);
    return this.toResposeObject({ ...idea, author: user });
  }

  async read(id: string): Promise<IdeaRO> {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return this.toResposeObject(idea);
  }

  async update(id: string, data: Partial<IdeaDTO>, userId: string): Promise<IdeaRO> {
    let idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnerShip(idea, userId)
    await this.ideaRepository.update({ id }, data);
    idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
    return this.toResposeObject(idea);
  }

  async destory(id: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author'] });
    if (!idea) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    this.ensureOwnerShip(idea, userId)
    await this.ideaRepository.delete({ id });
    return this.toResposeObject(idea);
  }
}
