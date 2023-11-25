import { Column, Entity, OneToMany } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";
import { BaseModel } from "src/common/entity/base.entity";
import { IsEmail, IsString, Length } from "class-validator";
import { min } from "rxjs";

@Entity()
export class UsersModel extends BaseModel{

     @Column({
          // 1)
          length: 20,
          // 2)
          unique: true,
     })
     @IsString()
     @Length(1, 20,{
          message: '닉네임은 1~20자 사이로 입력해주세요.'
     })
     // 1) 길이가 20넘지 않기
     // 2) 유니크
     nickname: string;

     @Column({
          unique: true
     })
     @IsString()
     @IsEmail()
     // 1) 유니크
     email: string;

     @Column()
     @IsString()
     @Length(3, 8,{
          message: '비밀번호는 3~8자 사이로 입력해주세요.'
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