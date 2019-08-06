import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { UserEntity } from 'src/user/user.entity'
import { userInfo } from 'os'

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  idea: string

  @Column('text')
  desc: string

  @CreateDateColumn()
  created: Date

  @UpdateDateColumn()
  updated: Date

  @ManyToOne(type => UserEntity, user => user.ideas)
  author: UserEntity

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  upvotes: UserEntity[]

  @ManyToMany(type => UserEntity, { cascade: true })
  @JoinTable()
  downvotes: UserEntity[]
}
