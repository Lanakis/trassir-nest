import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({ description: 'Login пользователя' })
  @IsString()
  login: string;

  @ApiProperty({ description: 'Пароль пользователя.' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
