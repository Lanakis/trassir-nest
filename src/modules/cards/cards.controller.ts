import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../http-exception.filter';
import { CardsService } from './cards.service';
import { CreateCardsDto } from './dto/create-cards.dto';
import { UpdateCardsDto } from './dto/update-cards.dto';
import { UseSessionGuard } from '../../common/decorator/session.decorator';

@UseFilters(new HttpExceptionFilter())
@Controller('cards')
export class CardsController {
  constructor(private readonly panelsService: CardsService) {}
  @UseSessionGuard()
  @Post()
  create(@Body() createUsersDto: CreateCardsDto) {
    return this.panelsService.create(createUsersDto);
  }
  @UseSessionGuard()
  @Get('/test')
  test() {
    return this.panelsService.test();
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
  update(@Param('id') id: string, @Body() updateUserListDto: UpdateCardsDto) {
    return this.panelsService.update(id, updateUserListDto);
  }
  @UseSessionGuard()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.panelsService.remove(id);
  }
}
