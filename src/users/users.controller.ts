import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { MyAccountGuard } from './guards/my-account.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiResponse({
    status: 200,
    description: 'Logged in user.',
    type: User,
  })
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'All users.',
    type: [User],
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User',
    type: User,
  })
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), MyAccountGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated.',
    type: User,
  })
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), MyAccountGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User deleted.',
  })
  remove(@Param('id') id: number, @Request() req) {
    return this.usersService.remove(+id);
  }
}
