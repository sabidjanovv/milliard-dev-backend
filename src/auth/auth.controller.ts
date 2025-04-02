import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  Param,
  Req,
  Get,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignInDto } from './dto/signin.dto';
import { Request } from 'express';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { JwtGuard } from '../common/guard/jwt.guard';
import { RefreshTokenGuard } from '../common/guard/refresh-token.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  // @UseGuards()
  @Post('signup')
  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  signUp(@Body() createAuthDto: CreateAdminDto) {
    const adminId = '';
    return this.authService.signUp(createAuthDto, adminId);
  }
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({
    status: 200,
    description: 'User signed in successfully',
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({ summary: 'Sign out user' })
  @ApiResponse({ status: 200, description: 'User signed out successfully' })
  @ApiParam({
    name: 'id',
    description: 'Enter the user id',
    example: 'jfdlkafdsa',
  })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('signout/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async logout(@Param('id') userId: string) {
    return this.authService.signOut(userId);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'New tokens generated' })
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshTokens(@Req() req: Request) {
    console.log('REFRESH TOKEN REQUEST:', req.user);
    return this.authService.refreshTokens(req);
  }

  @Get('/profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User profile data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - No token provided' })
  async profileCheck(@Headers('authorization') authorization: string) {
    if (!authorization || !authorization.startsWith('Bearer')) {
      throw new UnauthorizedException('Authorization token not provided');
    }
    const access_token = authorization.split(' ')[1];
    return await this.authService.profileCheck(access_token);
  }
}
