import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-users.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsersDto extends PartialType(CreateUsersDto) {
  @ApiProperty({ description: 'Рефреш токен' })
  hashedCredentials: string;
}
