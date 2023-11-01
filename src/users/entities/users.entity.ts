import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostModel } from "src/posts/posts.service";
import { PostsModel } from "src/posts/entities/posts.entity";

@Entity()
export class UsersModel {

     @PrimaryGeneratedColumn()
     id: number;

     @Column({
          length: 20,
          unique: true
     })
     // 1) 길이가 20넘지 않기
     // 2) 유니크
     nickname: string;

     @Column({
          unique: true
     })
     // 1) 유니크
     email: string;

     @Column()
     password: string;

     @Column({
          enum: Object.values(RolesEnum),
          default: RolesEnum.USER
     })
     role: RolesEnum;


     @OneToMany(() => PostsModel, (post) => post.author)
     posts: PostsModel[];
}