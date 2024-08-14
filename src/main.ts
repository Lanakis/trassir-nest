import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from './utils/validation.pipe';
import { MikroORM } from '@mikro-orm/core';
import * as fs from 'fs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
declare const module: any;
import * as bodyParser from 'body-parser';
dayjs.extend(utc);
dayjs().utcOffset('+03:00');

const httpsOptions = {
  key: fs.existsSync(configService.getServer().sslKey)
    ? fs.readFileSync(configService.getServer().sslKey, 'utf-8')
    : '',
  cert: fs.existsSync(configService.getServer().sslKey)
    ? fs.readFileSync(configService.getServer().sslCert, 'utf-8')
    : '',
  secureProtocol: 'TLSv1_2_method',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, configService.isProduction() ? { httpsOptions } : {});
  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getSchemaGenerator().updateSchema();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(configService.getServer().port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
