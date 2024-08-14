import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateOptions, FindOneOptions, RequiredEntityData } from '@mikro-orm/core';
import { plainToClass } from 'class-transformer';
import { CreateExternalUsersDto } from '../dto/create-external-users.dto';
import { UpdateExternalUsersDto } from '../dto/update-external-users.dto';
import { Merge, RemoveEmptyAndArray } from '../../../utils/utils';
import { ExternalUsersNotFoundException } from '../exceptions/external-users-not-found.exception';
import { ExternalUsers } from '../entities/external-users.entity';

export class ExternalUsersRepository extends EntityRepository<ExternalUsers> {
  create<P = never>(
    data: RequiredEntityData<ExternalUsers | CreateExternalUsersDto>,
    options?: CreateOptions,
  ): ExternalUsers {
    const cards = plainToClass(ExternalUsers, data, { excludeExtraneousValues: true });
    return super.create(cards, options);
  }

  async update<P extends string = never>(
    id: string,
    data: RequiredEntityData<ExternalUsers | UpdateExternalUsersDto>,
    options?: FindOneOptions<ExternalUsers, P>,
  ): Promise<ExternalUsers> {
    const card = await this.findOne({ id }, options);
    if (!card) {
      throw new ExternalUsersNotFoundException();
    }

    const cleanedData = RemoveEmptyAndArray(data);
    Merge(cleanedData, card);
    await this.em.flush();

    return card;
  }
}
