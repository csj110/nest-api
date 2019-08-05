import { ValidationPipe } from './../shared/validation.pipe';
import { UserService } from './user.service';
import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';
import { UserDTO, UserRO } from './user.dto';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
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
  @UsePipes(new ValidationPipe())
  async showAllUsers(): Promise<UserRO[]> {
    return await this.userService.showAll();
  }
}
