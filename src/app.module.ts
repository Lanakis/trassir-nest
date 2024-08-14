import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { SessionModule } from './modules/session/session.module';
import { PanelsModule } from './modules/panels/panels.module';
import { MySQLModule } from './modules/external-db/mysql-db.module';
import { CardsModule } from './modules/cards/cards.module';
import { ExternalUsersModule } from './modules/external-users/external-users.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    UsersModule,
    PanelsModule,
    SessionModule.forRoot(),
    MySQLModule,
    CardsModule,
    ExternalUsersModule,
  ],
  providers: [AppModule],
})
export class AppModule {}
