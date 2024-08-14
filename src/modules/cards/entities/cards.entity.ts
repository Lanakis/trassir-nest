import { Entity, EntityRepositoryType, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../../utils/base-entity';
import { CardsRepository } from '../repository/cards.repository';
import { Expose } from 'class-transformer';
import { ExternalUsers } from '../../external-users/entities/external-users.entity';

@Entity({ customRepository: () => CardsRepository })
export class Cards extends BaseEntity {
  [EntityRepositoryType]?: CardsRepository;

  @Expose()
  @Property()
  card_no: string;

  @Expose()
  @Property({ default: 0 })
  card_type: number;

  @Expose()
  @Property()
  card_name: string;

  @Expose()
  @Property({ default: 0 })
  card_status: number;

  @ManyToOne(() => ExternalUsers, { nullable: false, hidden: true })
  externalUser: ExternalUsers;
}
