import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

import { join } from 'path';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
declare const module: any;

const PREFIX_ROUTE = "api/v1"
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const kafka = app.connectMicroservice({
    transport: Transport.KAFKA,
      options: {
        client: {
          // clientId: 'user-service',
          brokers: ['192.168.1.9:9092'],
        },
        // run: {
        //   partitionsConsumedConcurrently: numbersOfServers,
        // },
      },
  })
  await kafka.listen()

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
