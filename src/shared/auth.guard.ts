import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import "dotenv/config"
import { GqlExecutionContext } from '@nestjs/graphql';
import { removeAllListeners } from 'cluster';
import { createTextChangeRange } from 'typescript';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req) {
      if (!req.headers.authorization) {
        return false;
      }
      req.user = await this.validateToken(req.headers.authorization);
      return true;
    } else {
      const ctx: any = GqlExecutionContext.create(context).getContext();
      if (!ctx.headers.authorization) {
        return false;
      }
      ctx.user = await this.validateToken(ctx.headers.authorization);
      return true;
    }
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, process.env.SECRET);
      Logger.log(decoded);
      return decoded;
    } catch (error) {
      const message = 'Token error ' + error.message || error.name;
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
