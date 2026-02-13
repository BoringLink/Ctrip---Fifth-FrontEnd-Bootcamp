import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest();

    // 从请求头获取令牌
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is required');
    }

    // 提取令牌
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    try {
      // 验证令牌
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key',
      ) as any;

      // 将用户信息添加到请求对象
      request.user = {
        id: decoded.userId,
        role: decoded.role,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
