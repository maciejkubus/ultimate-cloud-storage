import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authenticationservice';
import { RegisterDto } from './dto/register-dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private AuthenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.AuthenticationService.login(req.user);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.AuthenticationService.register(body);
  }
}
