import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('idea')
export class IdeaEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column('text') idea: string;
  @Column('text') desc: string;
  @CreateDateColumn() created: Date;
  @UpdateDateColumn() updated: Date;
}
