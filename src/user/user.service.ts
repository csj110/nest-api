import { InjectRepository } from '@nestjs/typeorm'
import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { UserDTO, UserRO } from './user.dto'
import { IdeaEntity } from 'src/idea/idea.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(IdeaEntity) private ideareposity: Repository<IdeaEntity>,
  ) { }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['ideas'],
    })
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('wrong user/password', HttpStatus.BAD_REQUEST)
    }
    return user.toResponseObject(true)
  }

  async register(data: UserDTO): Promise<UserRO> {
    const { username } = data
    let user = await this.userRepository.findOne({ where: { username } })
    if (!user) {
      throw new HttpException('no such a user', HttpStatus.BAD_REQUEST)
    }
    user = await this.userRepository.create(data)
    await this.userRepository.save(user)
    return user.toResponseObject(true)
  }

  async showAll(page: number = 1): Promise<UserRO[]> {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
      take: 8,
      skip: 8 * (page - 1),
    })
    return users.map(user => user.toResponseObject())
  }

  async read(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['ideas', 'bookmarks'],
    })
    if (!user) {
      throw new HttpException('no such a user', HttpStatus.BAD_REQUEST)
    }
    return user.toResponseObject()
  }
}
