import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length, ValidationArguments } from "class-validator";
import { min } from "rxjs";
import { lengthValidationMessage } from "src/common/validation-message/length-validation.message";
import { stringValidationMessage } from "src/common/validation-message/string-validation.message";
import { emailValidationMessage } from "src/common/validation-message/email-validation.message";

@Entity()
export class UsersModel extends BaseModel{

     @Column({
          // 1)
          length: 20,
          // 2)
          unique: true,
     })
     @IsString({
          message: stringValidationMessage,
     })
     @Length(1, 20,{
          message: lengthValidationMessage,
     })
     // 1) 길이가 20넘지 않기
     // 2) 유니크
     nickname: string;

     @Column({
          unique: true
     })
     @IsString({
          message: stringValidationMessage,
     })
     @IsEmail({}, {
          message: emailValidationMessage,
     })
     // 1) 유니크
     email: string;

     @Column()
     @IsString({
          message: stringValidationMessage,
     })
     @Length(3, 8,{
          message: lengthValidationMessage,
     })
     password: string;

     @Column({
          enum: Object.values(RolesEnum), // RolesEnum의 value 값들을 가져와서 enum으로 사용
          default: RolesEnum.USER
     })
     role: RolesEnum; // RolesEnum.USER RolesEnum.ADMIN

     @OneToMany(() => PostsModel, (post) => post.author)
     posts: PostsModel[];
}