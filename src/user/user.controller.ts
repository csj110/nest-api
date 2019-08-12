import { ValidationPipe } from './../shared/validation.pipe'
import { UserService } from './user.service'
import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  UseGuards,
  Logger,
  Query,
} from '@nestjs/common'
import { UserDTO, UserRO } from './user.dto'
import { User } from './user.decorator'
import { AuthGuard } from 'src/shared/auth.guard'

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('auth/login')
  async login(@Body() data: UserDTO): Promise<UserRO> {
    return await this.userService.login(data)
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  async register(@Body() data: UserDTO): Promise<UserRO> {
    return await this.userService.register(data)
  }

  @Get('api/user/all')
  async showAllUsers(
    @User() user: any,
    @Query('page') page: number,
  ): Promise<UserRO[]> {
    return await this.userService.showAll()
  }

  @Get('api/user/whoami')
  @UseGuards(new AuthGuard())
  async whoami(@User('username') username: string) {
    return this.userService.read(username)
  }
}
