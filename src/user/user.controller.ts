import { ValidationPipe } from './../shared/validation.pipe';
import { UserService } from './user.service';
import { Controller, Post, Get, Body, UsePipes, UseGuards, Logger } from '@nestjs/common';
import { UserDTO, UserRO } from './user.dto';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from './user.decorator';

@Controller()
export class UserController {
  constructor(private userService: UserService) { }
  @Post('login')
  async login(@Body() data: UserDTO): Promise<UserRO> {
    return await this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() data: UserDTO): Promise<UserRO> {
    return await this.userService.register(data);
  }

  @Get('api/users')
  async showAllUsers(@User() user: any): Promise<UserRO[]> {
    return await this.userService.showAll();
  }
}
