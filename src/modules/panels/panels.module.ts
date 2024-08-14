import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PanelsService } from './panels.service';
import { PanelsController } from './panels.controller';
import { Panels } from './entities/panels.entity';
import { SessionModule } from '../session/session.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpRequestModule } from '../http-request/http-request.module';

@Module({
  controllers: [PanelsController],
  imports: [
    MikroOrmModule.forFeature({ entities: [Panels] }),
    SessionModule,
    ScheduleModule.forRoot(),
    HttpRequestModule,
  ],
  providers: [PanelsService],
  exports: [PanelsService],
})
export class PanelsModule {}
