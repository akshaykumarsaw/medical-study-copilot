import { Controller, Post, Body, Get, UseGuards, Req, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const { password_hash, ...user } = req.user;
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    // Basic implementation for profile update
    const userId = req.user.id;
    // ... logic to update profile in supabase
    return { message: 'Profile update logic to be implemented' };
  }
}
