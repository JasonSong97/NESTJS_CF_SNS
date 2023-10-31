import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsModel } from './entities/posts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ // Repository 주입시
      // 불러오고 싶은 모델 넣기
      PostsModel,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
