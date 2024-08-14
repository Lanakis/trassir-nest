import { IsOptional, IsString } from 'class-validator';

export class AuthorizeDto {
  @IsOptional()
  @IsString()
  login?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  sid?: string;
}

export class UpdateSession extends AuthorizeDto {}
