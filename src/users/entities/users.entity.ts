import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "../const/roles.const";
import { PostsModel } from "src/posts/entities/posts.entity";

@Entity()
export class UsersModel {

     @PrimaryGeneratedColumn()
     id: number;

     @Column({
          // 1)
          length: 20,
          // 2)
          unique: true,
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
          enum: Object.values(RolesEnum), // RolesEnum의 value 값들을 가져와서 enum으로 사용
          default: RolesEnum.USER
     })
     role: RolesEnum; // RolesEnum.USER RolesEnum.ADMIN

     @OneToMany(() => PostsModel, (post) => post.author)
     posts: PostsModel[];
}