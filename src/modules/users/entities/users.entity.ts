import { Entity, EntityRepositoryType, OneToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../utils/base-entity';
import { Expose } from 'class-transformer';
import { UsersRepository } from '../repository/users.repository';
import { Session } from '../../session/entities/session.entity';

@Entity({ customRepository: () => UsersRepository })
export class Users extends BaseEntity {
  [EntityRepositoryType]?: UsersRepository;

  @Expose()
  @Property({ length: 20, unique: true })
  login: string;

  @Expose()
  @Property({ hidden: true })
  password: string;

  @OneToOne(() => Session, (session) => session.user, {
    owner: true,
    nullable: true,
  })
  session: Session;
}
