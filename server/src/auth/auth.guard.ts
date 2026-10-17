import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');

      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    // 1. Check cookies first
    if (request.cookies?.accessToken) {
      return request.cookies.accessToken;
    }

    // 2. Check Authorization header (Bearer <token>)
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer' && token) {
      return token;
    }

    return undefined;
  }
}
