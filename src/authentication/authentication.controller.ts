import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { AuthenticationService } from './authenticationservice';
import { LoginDto } from './dto/login-dto';
import { RegisterDto } from './dto/register-dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private AuthenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        },
      },
    },
  })
  async login(@Request() req) {
    return this.AuthenticationService.login(req.user);
  }

  @Post('register')
  @ApiBody({
    type: RegisterDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: () => User,
  })
  async register(@Body() body: RegisterDto) {
    return this.AuthenticationService.register(body);
  }
}
