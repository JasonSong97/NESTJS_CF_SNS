import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // NestJS에 전반적으로 적용할 Pipe 넣는 것(각 Module에 따로 적용할 필요가 없음)
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 변화는 해도 된다는 의미 -> order__createdAt 디폴트값을 ASC로
  }));

  await app.listen(3000);
}
bootstrap();
 