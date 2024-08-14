import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../http-exception.filter';
import { ExternalUsersService } from './external-users.service';
import { CreateExternalUsersDto } from './dto/create-external-users.dto';
import { UpdateExternalUsersDto } from './dto/update-external-users.dto';
import { UseSessionGuard } from '../../common/decorator/session.decorator';

@UseFilters(new HttpExceptionFilter())
@Controller('external-users')
export class ExternalUsersController {
  constructor(private readonly externalUsersService: ExternalUsersService) {}
  @UseSessionGuard()
  @Post()
  create(@Body() createUsersDto: CreateExternalUsersDto) {
    return this.externalUsersService.create(createUsersDto);
  }

  @UseSessionGuard()
  @Get()
  async findAll() {
    return await this.externalUsersService.findAll();
  }

  @UseSessionGuard()
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.externalUsersService.findOne(id);
  }

  @UseSessionGuard()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserListDto: UpdateExternalUsersDto) {
    return this.externalUsersService.update(id, updateUserListDto);
  }
  @UseSessionGuard()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.externalUsersService.remove(id);
  }
}
