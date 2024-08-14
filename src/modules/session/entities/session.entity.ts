import { Cascade, Entity, OneToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../utils/base-entity';
import { Expose } from 'class-transformer';
import { Users } from '../../users/entities/users.entity';
import { SessionRepository } from '../repository/session.repository';

@Entity({ customRepository: () => SessionRepository })
export class Session extends BaseEntity {
  @Expose()
  @Property({ unique: true })
  sid: string;

  @Expose()
  @Property({ nullable: true })
  ipAddress: string;

  @OneToOne(() => Users, (user) => user.session, {
    nullable: false,
    hidden: true,
    cascade: [Cascade.REMOVE],
  })
  user: Users;
}
