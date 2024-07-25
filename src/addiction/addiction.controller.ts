import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { AddictionService } from './addiction.service';
import { CreateAddictionDto } from './dto/create-addiction.dto';
import { UpdateAddictionDto } from './dto/update-addiction.dto';
import { Addiction } from './entities/addiction.entity';
import { AddictionOwnerGuard } from './guards/addiction-owner.guard';

@Controller('addiction')
export class AddictionController {
  constructor(private readonly addictionService: AddictionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Addiction created',
    type: Addiction,
  })
  create(@Body() createAddictionDto: CreateAddictionDto, @Request() req) {
    return this.addictionService.create(createAddictionDto, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('mine')
  @ApiResponse({
    status: 200,
    description: 'Notes of logged in user.',
    type: Paginated<Addiction>,
  })
  async findAll(@Request() req, @Paginate() query: PaginateQuery) {
    return await this.addictionService.findAll(req.user.id, query);
  }

  @UseGuards(AuthGuard('jwt'), AddictionOwnerGuard)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Addiction',
    type: Addiction,
  })
  findOne(@Param('id') id: string, @Request() req) {
    return this.addictionService.findOne(+id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'), AddictionOwnerGuard)
  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Addiction updated',
    type: Addiction,
  })
  update(
    @Param('id') id: string,
    @Body() updateAddictionDto: UpdateAddictionDto,
    @Request() req,
  ) {
    return this.addictionService.update(+id, updateAddictionDto);
  }

  @UseGuards(AuthGuard('jwt'), AddictionOwnerGuard)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Addiction deleted',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.addictionService.remove(+id);
  }
}
