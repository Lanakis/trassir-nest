import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../utils/base-entity';
import { ExternalUsersRepository } from '../repository/external-users.repository';
import { EntityRepositoryType } from '@mikro-orm/core';
import { Expose } from 'class-transformer';
import { Panels } from '../../panels/entities/panels.entity';
import { Cards } from '../../cards/entities/cards.entity';

@Entity({ customRepository: () => ExternalUsersRepository })
export class ExternalUsers extends BaseEntity {
  [EntityRepositoryType]?: ExternalUsersRepository;

  @Expose()
  @Property({ nullable: false })
  user_id!: string;

  @Expose()
  @Property({ nullable: true, default: '' })
  account?: string;

  @Expose()
  @Property({ default: 2 })
  authority!: number;

  @Expose()
  @Property({ nullable: true, default: '' })
  citizen_id_no?: string;

  @Expose()
  @Property({ default: [0, 1] })
  doors!: number[];

  @Expose()
  @Property({ default: false })
  is_first_enter!: boolean;

  @Expose()
  @Property({ default: 0 })
  is_subscribed!: number;

  @Expose()
  @Property({ nullable: true, default: '' })
  mobile_info?: string;

  @Expose()
  @Property({ nullable: true, default: '' })
  password?: string;

  @Expose()
  @Property({ nullable: true, default: null })
  room_no?: string | null;

  @Expose()
  @Property({ default: 0 })
  use_time!: number;

  @Expose()
  @Property({ nullable: true, default: '' })
  user_name?: string;

  @Expose()
  @Property({ default: 0 })
  user_status!: number;

  @Expose()
  @Property({ default: 0 })
  user_type!: number;

  @Expose()
  @Property({ nullable: true, default: '' })
  vto_position?: string;

  @Expose()
  @Property({ default: '0000-00-00 00:00:00' })
  valid_from!: string;

  @Expose()
  @Property({ default: '0000-00-00 00:00:00' })
  valid_to!: string;

  @ManyToOne(() => Panels, { nullable: false, hidden: true })
  panel: Panels;

  @OneToMany(() => Cards, (card) => card.externalUser, {
    cascade: [Cascade.REMOVE],
  })
  cards = new Collection<Cards>(this);
}
