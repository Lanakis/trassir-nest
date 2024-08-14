import { IsString } from 'class-validator';

export class CreatePanelsDto {
  @IsString()
  device_name: string;

  @IsString()
  device_id: string;

  @IsString()
  description: string;

  @IsString()
  ip: string;
  @IsString()
  login: string;

  @IsString()
  password: string;
  @IsString()
  isOnline: boolean;
  @IsString()
  ses: string;
}
