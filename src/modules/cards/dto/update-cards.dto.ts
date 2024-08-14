import { PartialType } from '@nestjs/mapped-types';
import { CreateCardsDto } from './create-cards.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCardsDto extends PartialType(CreateCardsDto) {
  @ApiProperty({ description: 'Рефреш токен' })
  hashedCredentials: string;
}
