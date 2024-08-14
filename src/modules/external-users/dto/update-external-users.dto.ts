import { PartialType } from '@nestjs/mapped-types';
import { CreateExternalUsersDto } from './create-external-users.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExternalUsersDto extends PartialType(CreateExternalUsersDto) {
  @ApiProperty({ description: 'Рефреш токен' })
  hashedCredentials: string;
}
