import { IsString } from "class-validator";

// yarn add class-validator(검증) class-transformer(변환)
// github.com/typestack/class-validator -> validator-decorators
export class CreatePostDto {

     @IsString({
          message: 'title은 string 타입을 입력 해줘야합니다.'
     })
     title: string;

     @IsString({
          message: 'content는 string 타입을 입력 해줘야합니다.'
     }) 
     content: string;
}