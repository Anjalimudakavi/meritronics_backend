import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express'; // ✅ Fix here

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3001', 'http://54.177.111.218:3000','http://54.177.111.218:3001'],

    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(4000);
}
bootstrap();




