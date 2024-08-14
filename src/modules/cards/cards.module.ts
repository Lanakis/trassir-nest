import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

import { SessionModule } from '../session/session.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpRequestModule } from '../http-request/http-request.module';
import { Cards } from './entities/cards.entity';
import { ExternalUsersModule } from '../external-users/external-users.module';

@Module({
  controllers: [CardsController],
  imports: [
    MikroOrmModule.forFeature({ entities: [Cards] }),
    SessionModule,
    ScheduleModule.forRoot(),
    HttpRequestModule,
    ExternalUsersModule,
  ],
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
