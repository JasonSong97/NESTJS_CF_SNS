import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // NestJS에 전반적으로 적용할 Pipe 넣는 것(각 Module에 따로 적용할 필요가 없음)
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // 변화는 해도 된다는 의미 -> order__createdAt 디폴트값을 ASC로

    // 어노테이션이 있으면 자동으로 Class Transformer가 적용되도록한다. 
    transformOptions: {
      // 임의로 변환하는 것을 허용한다. @IsNumber(), @IsIn, @IsOptional .. 전부 허용
      // 따라서 @Type(() => Number) 필요 없다
      enableImplicitConversion: true, 
    }
  }));

  await app.listen(3000);
}
bootstrap();
 