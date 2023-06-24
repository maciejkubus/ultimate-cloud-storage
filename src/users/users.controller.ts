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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { ChangePasswordDto } from './dto/change-password-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { MyAccountGuard } from './guards/my-account.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
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
    type: Paginated<User>,
  })
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.usersService.findAll(query);
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
  @Patch(':id/change-password')
  @ApiResponse({
    status: 200,
    description: 'User updated.',
    type: User,
  })
  changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    return this.usersService.changePassword(+id, changePasswordDto);
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
