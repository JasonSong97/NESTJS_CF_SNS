import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export interface PostModel {
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
          return this.postsRepository.find();
     }

     async getPostById(id: number) {
          const post = await this.postsRepository.findOne({
               where: { 
                    id
               },
          });

          if (!post) {
               throw new NotFoundException();
          }
          return post;
     }
     
     async createPost(author: string, title: string, content: string) {
          // 1) create -> 저장할 객체를 생성한다
          // 2) save -> 객체를 저장한다. (create 메소드에서 생성한 객체로)

          // 저장이 아닌 객체생성 따라서 동기로 이루어짐
          const post = this.postsRepository.create({ 
               author,
               title,
               content,
               likeCount: 0,
               commentCount: 0,
          }); // post는 id 값이 없다

          const newPost = await this.postsRepository.save(post);
          return newPost;
     }
     
     async updatePost(postId:number, author: string, title: string, content: string) {
          // save의 기능
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

          if (author) { 
               post.author = author;
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
