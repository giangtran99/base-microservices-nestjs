import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import Config from 'nest.config';
import helmet from 'helmet';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
declare const module: any;

const PREFIX_ROUTE = "api/v1"
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       brokers: ['192.168.1.18:9092'],
  //     },
  //     consumer: {
  //       groupId: 'user-consumer', // hero-consumer-client,
  //       sessionTimeout: 10000,

  //     }
  //   }
  // });
  // await app.startAllMicroservices();
  app.setGlobalPrefix(PREFIX_ROUTE);
  // // app.useStaticAssets(join(__dirname, '..', 'public'));
  // // app.useStaticAssets(join(__dirname, '..', 'uploads'));
  // // app.use(cookieParser());
  // // app.use(helmet());
  await app.listen(3000);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
