import { IsString } from "class-validator";

// yarn add class-validator(검증) class-transformer(변환)
export class CreatePostDto {

     @IsString()
     title: string;

     @IsString() 
     content: string;
}