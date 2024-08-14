import { Global, DynamicModule, Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Session } from './entities/session.entity';
import { UsersModule } from '../users/users.module';
import { SessionGuard } from '../../common/guard/session.guard';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Session] }), UsersModule],
  providers: [SessionService, SessionGuard],
  exports: [SessionService, SessionGuard],
})
export class SessionModule {
  static forRoot(): DynamicModule {
    return {
      module: SessionModule,
      controllers: [SessionController],
      imports: [MikroOrmModule.forFeature({ entities: [Session] }), UsersModule],
      providers: [SessionService, SessionGuard],
      exports: [SessionService, SessionGuard],
    };
  }

  static init(): DynamicModule {
    return {
      module: SessionModule,
    };
  }
}
