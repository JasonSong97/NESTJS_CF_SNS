import { PickType } from "@nestjs/mapped-types";
import { PostsModel } from "../entities/posts.entity"

/**
 * yarn add class-validator(검증) class-transformer(변환)
 * github.com/typestack/class-validator -> validator-decorators
 * 
 * TS에서 사용한 Utilities
 * - Pick, Omit, Partial -> Type 반환, Generic
 * - PickType, OmitType, PartialType -> 값을 반환, function
 * 
 * extends:는 Type을 상속받지 못하고 값을 상속받아야한다! (중요!)
 * PickType(PostsModel, ['title', 'content']): title과 content만 상속받기
 */
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']){}