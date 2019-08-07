import { IdeaDTO, IdeaRO } from './idea.dto';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/user/user.decorator';
import { UserRO } from 'src/user/user.dto';
import { Votes } from 'src/shared/votes.enum';

@Controller('api/idea')
export class IdeaController {
  constructor(private ideaService: IdeaService) { }
  private logger = new Logger('IdeaController');
  private logData(opts: any) {
    opts.id && this.logger.log('idea' + JSON.stringify(opts.id));
    opts.data && this.logger.log('body' + JSON.stringify(opts.data));
    opts.user && this.logger.log('user' + JSON.stringify(opts.user));
  }
  @Get('all')
  showAllIdea() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDTO, @User('id') user: string) {
    this.logData({ user, data })
    return this.ideaService.create(data, user);
  }

  @Get(':id')
  showIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  async updateIdea(@Param('id') id: string, @User('id') user: string, @Body() data: Partial<IdeaDTO>) {
    this.logData({ user, id, data })
    return await this.ideaService.update(id, data, user);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async removeIdea(@Param('id') id: string, @User('id') user: string) {
    this.logData({ id, user })
    return await this.ideaService.destory(id, user);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  async  bookmarkIdea(@Param("id") id: string, @User('id') user: string): Promise<UserRO> {
    this.logData({ id, user })
    return await this.ideaService.bookmark(id, user)
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  async unbookmarkIdea(@Param("id") id: string, @User('id') user: string): Promise<UserRO> {
    this.logData({ id, user })
    return await this.ideaService.unbookmark(id, user)
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  async upvoteIdea(@Param("id") id: string, @User('id') user: string): Promise<IdeaRO> {
    this.logData({ id, user })
    return await this.ideaService.dealVote(id, user, Votes.UP)
  }

  @Delete(':id/downvote')
  @UseGuards(new AuthGuard())
  async downvote(@Param("id") id: string, @User('id') user: string): Promise<IdeaRO> {
    this.logData({ id, user })
    return await this.ideaService.dealVote(id, user, Votes.DOWN)
  }
}
