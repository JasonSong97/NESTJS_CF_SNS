import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length } from "class-validator";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";
import { Exclude, Expose } from "class-transformer";

@Entity()
export class UsersModel extends BaseModel{

     // 1) 길이가 20넘지 않기 2) 유니크
     @Column({length: 20,unique: true,})
     @IsString({message: stringValidationMessage,})
     @Length(1, 20,{message: lengthValidationMessage,}) 
     nickname: string;

     // 1) 유니크
     @Column({unique: true})
     @IsString({message: stringValidationMessage,})
     @IsEmail({}, {message: emailValidationMessage,})
     email: string;

     /**
      * App.module.ts -> providers에 APP_INTERCEPTOR 등록 필요
      * 
      * Request: toClassOnly -> class instance로 변환될 때만
      * front -> back: plain object (JSON) -> class instance (DTO)
      * 
      * Response: toPlainOnly -> plain object로 변환될 때만
      * back -> front: class instance (DTO) -> plain object (JSON)
      */
     @Exclude({toPlainOnly: true,}) // @Exclude(): Json 파싱 X, Response 상황에만 적용
     @Column()
     @IsString({message: stringValidationMessage,})
     @Length(3, 8,{message: lengthValidationMessage,})
     password: string;

     // RolesEnum의 value 값들을 가져와서 enum으로 사용
     @Column({enum: Object.values(RolesEnum), default: RolesEnum.USER})
     role: RolesEnum; // RolesEnum.USER RolesEnum.ADMIN

     @OneToMany(() => PostsModel, (post) => post.author)
     posts: PostsModel[];
}