import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({ // forRoot(): TypeORM-NestJS 연결고리
      type: 'postgres', // 데이터베이스 타입
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        PostsModel
      ], // 데이터와 연동될 모델
      synchronize: true, // TypeORM-DB 싱크 맞추기 -> 개발환경 true | production모드 false
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
