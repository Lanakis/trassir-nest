import { Cascade, Collection, Entity, EntityRepositoryType, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../utils/base-entity';
import { PanelsRepository } from '../repository/panels.repository';
import { Expose } from 'class-transformer';
import { ExternalUsers } from '../../external-users/entities/external-users.entity';

@Entity({ customRepository: () => PanelsRepository })
export class Panels extends BaseEntity {
  [EntityRepositoryType]?: PanelsRepository;

  @Expose()
  @Property({ unique: false })
  device_name: string;

  @Expose()
  @Property({})
  device_id: string;

  @Expose()
  @Property({})
  description: string;

  @Expose()
  @Property({})
  ip: string;

  @Expose()
  @Property({})
  login: string;

  @Expose()
  @Property({})
  password: string;

  @Expose()
  @Property({})
  isOnline: boolean;

  @Expose()
  @Property({ default: '' })
  ses: string;

  @OneToMany(() => ExternalUsers, (externalUsers) => externalUsers.panel, {
    cascade: [Cascade.REMOVE],
  })
  externalUsers = new Collection<ExternalUsers>(this);
}
