import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PostsModule,
    TypeOrmModule.forRoot({ // forRoot(): TypeORM-NestJS 연결고리
      // 데이터베이스 타입
      type: 'postgres', 
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [
        // entity 만들때마다 등록
        PostsModel,
        UsersModel,
      ], // 데이터와 연동될 모델
      synchronize: true, // TypeORM-DB 싱크 맞추기 -> 개발환경 true | production모드 false
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
