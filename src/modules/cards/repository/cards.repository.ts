import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateOptions, FindOneOptions, RequiredEntityData } from '@mikro-orm/core';
import { plainToClass } from 'class-transformer';
import { CreateCardsDto } from '../dto/create-cards.dto';
import { UpdateCardsDto } from '../dto/update-cards.dto';
import { Merge, RemoveEmptyAndArray } from '../../../utils/utils';
import { CardsNotFoundException } from '../exceptions/cards-not-found.exception';
import { Cards } from '../entities/cards.entity';

export class CardsRepository extends EntityRepository<Cards> {
  create<P = never>(data: RequiredEntityData<Cards | CreateCardsDto>, options?: CreateOptions): Cards {
    const cards = plainToClass(Cards, data, { excludeExtraneousValues: true });
    return super.create(cards, options);
  }

  async update<P extends string = never>(
    id: string,
    data: RequiredEntityData<Cards | UpdateCardsDto>,
    options?: FindOneOptions<Cards, P>,
  ): Promise<Cards> {
    const card = await this.findOne({ id }, options);
    if (!card) {
      throw new CardsNotFoundException();
    }

    const cleanedData = RemoveEmptyAndArray(data);
    Merge(cleanedData, card);
    await this.em.flush();

    return card;
  }
}
