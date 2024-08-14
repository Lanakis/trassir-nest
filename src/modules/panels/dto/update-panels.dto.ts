import { PartialType } from '@nestjs/mapped-types';
import { CreatePanelsDto } from './create-panels.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePanelsDto extends PartialType(CreatePanelsDto) {
  @ApiProperty({ description: 'Рефреш токен' })
  hashedCredentials: string;
}
