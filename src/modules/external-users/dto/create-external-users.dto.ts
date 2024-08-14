import { IsString, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateExternalUsersDto {
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  account?: string;

  @IsNumber()
  authority: number;

  @IsOptional()
  @IsString()
  citizen_id_no?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  doors: number[];

  @IsBoolean()
  is_first_enter: boolean;

  @IsNumber()
  is_subscribed: number;

  @IsOptional()
  @IsString()
  mobile_info?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  room_no?: string | null;

  @IsNumber()
  use_time: number;

  @IsOptional()
  @IsString()
  user_name?: string;

  @IsNumber()
  user_status: number;

  @IsNumber()
  user_type: number;

  @IsOptional()
  @IsString()
  vto_position?: string;

  @IsString()
  valid_from: string;

  @IsString()
  valid_to: string;

  @IsString()
  panel_id: string;
}
