import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../http-exception.filter';
import { PanelsService } from './panels.service';
import { CreatePanelsDto } from './dto/create-panels.dto';
import { UpdatePanelsDto } from './dto/update-panels.dto';
import { UseSessionGuard } from '../../common/decorator/session.decorator';

@UseFilters(new HttpExceptionFilter())
@Controller('panels')
export class PanelsController {
  constructor(private readonly panelsService: PanelsService) {}
  @UseSessionGuard()
  @Post()
  create(@Body() createUsersDto: CreatePanelsDto) {
    return this.panelsService.create(createUsersDto);
  }

  @UseSessionGuard()
  @Get()
  async findAll() {
    return await this.panelsService.findAll();
  }

  @UseSessionGuard()
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.panelsService.findOne(id);
  }

  @UseSessionGuard()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserListDto: UpdatePanelsDto) {
    return this.panelsService.update(id, updateUserListDto);
  }
  @UseSessionGuard()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panelsService.remove(id);
  }
}
