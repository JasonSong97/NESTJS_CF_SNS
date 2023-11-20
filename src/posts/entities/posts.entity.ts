import { BaseModel } from "src/common/entity/base.entity";
import { UsersModel } from "src/users/entities/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class PostsModel extends BaseModel{ // 외부에서 사용할 수 있어야하니까 export

     // 1) UsersModel 연동, FK를 이용해서
     // 2) Null이 될 수 없다
     @ManyToOne(() => UsersModel, (user) => user.posts, {
          nullable: false,
     })
     author: UsersModel;

     @Column()
     title: string;

     @Column()
     content: string;

     @Column()
     likeCount: number;

     @Column()
     commentCount: number;
}