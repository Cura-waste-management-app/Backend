import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe( // make validationPipe available globally
    // to reject fields from request body that are not in dto
  ));
  await app.listen(process.env.PORT || 8080);
}
bootstrap(); 
