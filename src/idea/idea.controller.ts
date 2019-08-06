import { IdeaDTO } from './idea.dto';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { ValidationPipe } from 'src/shared/validation.pipe';

@Controller('api/idea/all')
export class IdeaController {
  constructor(private ideaService: IdeaService) {}
  @Get()
  showAllIdea() {
    return this.ideaService.showAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  createIdea(@Body() data: IdeaDTO) {
    return this.ideaService.create(data);
  }

  @Get(':id')
  showIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  updateIdea(@Param('id') id: string, @Body() data: Partial<IdeaDTO>) {
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  removeIdea(@Param('id') id: string) {
    return this.ideaService.destory(id);
  }
}
