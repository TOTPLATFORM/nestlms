import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as path from 'path';
const bodyParser = require('body-parser');

import { AppModule } from './modules/app/app.module';
import { API_PREFIX } from './shared/constants/global.constants';
import { myLogger, setApp } from './shared/helpers/functions';
import { NestExpressApplication } from '@nestjs/platform-express';
import { coreConstant } from './shared/helpers/coreConstant';
import { MyLogger } from './modules/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  setApp(app);
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: '*', // 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  });
  // app.use(
  //   cors({
  //     // origin: process.env.FRONTEND_URL,
  //     allowedHeaders:"*",
  //     origin: '*',
  //     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  //     credentials: true,
  //   }),
  // );
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit for JSON requests
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' })); // Increase the limit for URL-encoded requests

  // Serve static files from storage directory
  app.useStaticAssets(
    path.join(__dirname, `../../${coreConstant.FILE_DESTINATION}`),
    {
      prefix: `/${coreConstant.FILE_DESTINATION}`,
    },
  );

    // Serve static files from images directory
    app.useStaticAssets(
      path.join(__dirname, `../../${coreConstant.IMAGES_DESTINATION}`),
      {
        prefix: `/${coreConstant.IMAGES_DESTINATION}`,
      },
    );

  // setApp(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.APP_PORT || 3005);
}
bootstrap();
