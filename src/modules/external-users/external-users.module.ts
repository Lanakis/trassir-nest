import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExternalUsersService } from './external-users.service';
import { ExternalUsersController } from './external-users.controller';

import { SessionModule } from '../session/session.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpRequestModule } from '../http-request/http-request.module';
import { ExternalUsers } from './entities/external-users.entity';
import { PanelsModule } from '../panels/panels.module';

@Module({
  controllers: [ExternalUsersController],
  imports: [
    MikroOrmModule.forFeature({ entities: [ExternalUsers] }),
    SessionModule,
    ScheduleModule.forRoot(),
    HttpRequestModule,
    PanelsModule,
  ],
  providers: [ExternalUsersService],
  exports: [ExternalUsersService],
})
export class ExternalUsersModule {}
