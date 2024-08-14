import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { Logger } from '@nestjs/common';
import { configService } from './config/config.service';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
const logger = new Logger('MikroORM');

const config: Options = {
  driver: PostgreSqlDriver,
  timezone: '+03:00',
  host: configService.getDb().host,
  port: +configService.getDb().port,
  user: configService.getDb().user,
  password: configService.getDb().password,
  dbName: configService.getDb().dbname,
  entities: ['dist/**/*.entity{.ts,.js}'],
  contextName: 'ais',
  // populateAfterFlush: false,
  // highlighter: new SqlHighlighter(),
  //debug: true,
  //logger: logger.log.bind(logger),
  allowGlobalContext: true,
  autoLoadEntities: true,
};

export default config;
