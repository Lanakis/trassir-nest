import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateOptions, FindOneOptions, RequiredEntityData } from '@mikro-orm/core';
import { plainToClass } from 'class-transformer';
import { UpdateSession } from '../dto/session.dto';
import { Session } from '../entities/session.entity';
import { Merge, RemoveEmptyAndArray } from '../../../utils/utils';
import { SessionNotFoundException } from '../exceptions/session-not-found.exception';

export class SessionRepository extends EntityRepository<Session> {
  create<P = never>(data: RequiredEntityData<Session>, options?: CreateOptions): Session {
    const entity = plainToClass(Session, data, { excludeExtraneousValues: true });
    return super.create(entity, options);
  }

  async update<P extends string = never>(
    id: string,
    data: RequiredEntityData<Session | UpdateSession>,
    options?: FindOneOptions<Session, P>,
  ): Promise<Session> {
    const user = await this.findOne({ id }, options);
    if (!user) {
      throw new SessionNotFoundException();
    }

    const cleanedData = RemoveEmptyAndArray(data);
    Merge(cleanedData, user);
    await this.flush();

    return user;
  }
}
