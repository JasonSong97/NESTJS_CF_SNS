import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, Patch, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Controller('posts')
export class PostsController {
  
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  //  모든 posts를 가져온다.
  @Get()
  getPosts(
    @Query() query: PaginatePostDto,
  ) {
    return this.postsService.paginatePosts(query);
    //return this.postsService.getAllPosts();
  }

  // 2) GET /posts/:id
  //  id에 해당되는 post를 가져온다.
  //  예) id=1인 경우 id가 1인 post를 가져온다.
  @Get(':id')
  getPost(
    // QueryParameter는 무조건 string으로 온다. 따라서 Int로 바꿔줘야한다. -> ParseIntPipe (자동으로 에러 던져줌)
    // NestJS가 DI해주는 것
    @Param('id', ParseIntPipe) id: number 
  ) {
    return this.postsService.getPostById(id);
  }

  // 3) POST /posts
  //  POST를 생성한다.
  //
  // DTO - Data Transfer Object
  @Post()
  @UseGuards(AccessTokenGuard) // 여기에 사용자의 id가 있다.
  postPosts(
    //@Request() req: any, // const authorId = req.user.id;
    // user 데코레이터를 사용할 수 있는 상황: AccessTokenGuard를 통과했을 때 왜냐하면 Request 객체에 사용자 정보가 있어야하기 때문에
    @User('id') userId: number, 
    @Body() body: CreatePostDto,
    // @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean, // 매번 새롭게 생성하는 것
  ) {
    return this.postsService.createPost(userId, body);
  }

  // 4) Patch /posts/:id
  //  id에 해당되는 POST를 변경한다.
  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  // 5) DELETE /posts/:id
  //  id에 해당되는 POST를 삭제한다.
  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.postsService.deletePost(id);
  }
}