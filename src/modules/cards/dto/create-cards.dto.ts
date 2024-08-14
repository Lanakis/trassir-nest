import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CardDto {
  @IsString()
  card_no: string;

  @IsNumber()
  card_type: number;

  @IsString()
  card_name: string;

  @IsNumber()
  card_status: number;
}

export class CreateCardsDto {
  @IsString()
  external_user_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  cards: CardDto[];
}
