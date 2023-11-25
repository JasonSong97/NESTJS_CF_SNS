import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';

export interface PostModel { // 외부 접근을 위해 export 추가
     id: number;
     author: string;
     title: string;
     content: string;
     likeCount: number;
     commentCount: number;
}
   
let posts: PostModel[] = [
{
     id: 1,
     author: 'newjeans_official',
     title: '뉴진스 민지',
     content: '춤추는 민지',
     likeCount: 10000000,
     commentCount: 9999999
},
{
     id: 2,
     author: 'newjeans_official',
     title: '뉴진스 해린',
     content: '고양이춤추는 해린',
     likeCount: 10000000,
     commentCount: 9999999
},
{
     id: 3,
     author: 'newjeans_official',
     title: '뉴진스 다니엘',
     content: '안경쓰는 다니엘',
     likeCount: 10000000,
     commentCount: 9999999
}
];

@Injectable()
export class PostsService {

     constructor(
          @InjectRepository(PostsModel)
          private readonly postsRepository: Repository<PostsModel>
     ) {}

     async getAllPosts() {
          return this.postsRepository.find({
               relations: [ // 현재 모델과 관련되어있는 것들 가져오기
                    'author',
               ]
          });
     }

     async getPostById(id: number) {
          const post = await this.postsRepository.findOne({
               where: { 
                    id // id: id -> key랑 value 동일한 경우 id 라고 가능
               },
               relations: [ // 추가
                    'author',
               ]
          });

          if (!post) {
               throw new NotFoundException();
          }
          return post;
     }
     
     async createPost(authorId: number, postDto: CreatePostDto) {
          // 1) create -> 저장할 객체를 생성한다
          // 2) save -> 객체를 저장한다. (create 메소드에서 생성한 객체로)

          // 저장이 아닌 객체생성 따라서 동기로 이루어짐 await를 붙일 필요 없음
          const post = this.postsRepository.create({ 
               author: { // 객체로 인식
                    id: authorId,
               },
               ...postDto, // JS 문법(스프레드)
               likeCount: 0,
               commentCount: 0,
          }); // post는 id 값이 없다 -> id는 DB에서 생성하기 때문에

          const newPost = await this.postsRepository.save(post); // 실제 DB에 저장된 정보(id 포함)
          return newPost;
     }
     
     async updatePost(postId:number, title: string, content: string) {
          // save의 2가지 기능
          // 1) 만약에 데이터가 존재하지 않으면 (id 기준으로) 새로 생성한다
          // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

          const post = await this.postsRepository.findOne({
               where: {
                    id: postId,
               },
          });

          if (!post) {
               throw new NotFoundException();
          }

          if (title) {
               post.title = title;
          }

          if (content) {
               post.content = content;
          }

          const newPost = await this.postsRepository.save(post);
          return newPost;
     }

     async deletePost(postId: number) {
          const post = await this.postsRepository.findOne({
               where: {
                    id: postId,
               },
          });
          if (!post) {
               throw new NotFoundException();
          }
          await this.postsRepository.delete(postId);
          return postId;
     }
}
