import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateOptions, FindOneOptions, RequiredEntityData } from '@mikro-orm/core';
import { plainToClass } from 'class-transformer';
import { CreatePanelsDto } from '../dto/create-panels.dto';
import { UpdatePanelsDto } from '../dto/update-panels.dto';
import { Merge, RemoveEmptyAndArray } from '../../../utils/utils';
import { PanelsNotFoundException } from '../exceptions/panels-not-found.exception';
import { Panels } from '../entities/panels.entity';

export class PanelsRepository extends EntityRepository<Panels> {
  create<P = never>(data: RequiredEntityData<Panels | CreatePanelsDto>, options?: CreateOptions): Panels {
    const panels = plainToClass(Panels, data, { excludeExtraneousValues: true });
    return super.create(panels, options);
  }

  async update<P extends string = never>(
    id: string,
    data: RequiredEntityData<Panels | UpdatePanelsDto>,
    options?: FindOneOptions<Panels, P>,
  ): Promise<Panels> {
    const user = await this.findOne({ id }, options);
    if (!user) {
      throw new PanelsNotFoundException();
    }

    const cleanedData = RemoveEmptyAndArray(data);
    Merge(cleanedData, user);
    await this.em.flush();

    return user;
  }
}
