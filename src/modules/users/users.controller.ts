import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from '../../http-exception.filter';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
import { SessionGuard } from '../../common/guard/session.guard';

@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(SessionGuard)
  @Post()
  create(@Body() createUsersDto: CreateUsersDto) {
    return this.usersService.create(createUsersDto);
  }

  @UseGuards(SessionGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @UseGuards(SessionGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.usersService.findOne(id);
  }

  @UseGuards(SessionGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserListDto: UpdateUsersDto) {
    return this.usersService.update(id, updateUserListDto);
  }
  @UseGuards(SessionGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
