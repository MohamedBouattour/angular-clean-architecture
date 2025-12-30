import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Auth Controller
 * Provides login and signup endpoints with mock JWT authentication
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: { email: string; password: string }) {
    return this.authService.login(credentials);
  }

  @Post('signup')
  async signup(@Body() userData: { name: string; email: string; password: string }) {
    return this.authService.signup(userData);
  }

  @Get('me')
  async getCurrentUser(@Request() req: any) {
    // In a real app, this would use a JWT guard
    return this.authService.getCurrentUser(req.headers.authorization);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { success: true, message: 'Logged out successfully' };
  }
}
