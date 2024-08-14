import { EntityRepository } from '@mikro-orm/postgresql';
import { CreateOptions, FindOneOptions, RequiredEntityData } from '@mikro-orm/core';
import { plainToClass } from 'class-transformer';
import { CreateUsersDto } from '../dto/create-users.dto';
import { UpdateUsersDto } from '../dto/update-users.dto';
import { Users } from '../entities/users.entity';
import { Merge, RemoveEmptyAndArray } from '../../../utils/utils';
import { UserNotFoundException } from '../exceptions/users-not-found.exception';

export class UsersRepository extends EntityRepository<Users> {
  create<P = never>(data: RequiredEntityData<Users | CreateUsersDto>, options?: CreateOptions): Users {
    const usersEntity = plainToClass(Users, data, { excludeExtraneousValues: true });
    return super.create(usersEntity, options);
  }

  async update<P extends string = never>(
    id: string,
    data: RequiredEntityData<Users | UpdateUsersDto>,
    options?: FindOneOptions<Users, P>,
  ): Promise<Users> {
    const user = await this.findOne({ id }, options);
    if (!user) {
      throw new UserNotFoundException();
    }

    const cleanedData = RemoveEmptyAndArray(data);
    Merge(cleanedData, user);
    await this.em.flush();

    return user;
  }
}
