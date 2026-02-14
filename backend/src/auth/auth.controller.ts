import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('认证')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '用户注册',
    description: '创建新用户并返回用户信息和JWT令牌',
  })
  @ApiBody({ type: RegisterDto, description: '注册信息' })
  @ApiResponse({
    status: 201,
    description: '注册成功',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        name: '用户名',
        role: 'merchant',
        token: 'jwt-token',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '邮箱已存在' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: '用户登录',
    description: '验证用户凭据并返回用户信息和JWT令牌',
  })
  @ApiBody({ type: LoginDto, description: '登录信息' })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        name: '用户名',
        role: 'merchant',
        token: 'jwt-token',
      },
    },
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '邮箱或密码错误' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({
    summary: '获取用户信息',
    description: '根据JWT令牌获取当前用户的详细信息',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      example: {
        id: 'uuid',
        email: 'user@example.com',
        name: '用户名',
        role: 'merchant',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: '未授权' })
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.validateUser(req.user.id);
  }
}
