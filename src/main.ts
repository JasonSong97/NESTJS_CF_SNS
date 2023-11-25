import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // NestJS에 전반적으로 적용할 Pipe 넣는 것(각 Module에 따로 적용할 필요가 없음)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
 