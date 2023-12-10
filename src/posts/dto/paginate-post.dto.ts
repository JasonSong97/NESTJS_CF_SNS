import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional } from "class-validator";

export class PaginatePostDto {

     // 이전 마지막 데이터의 ID
     // 이 프로퍼티에 입력된 ID보다 높은 ID 부터 값을 가져오기
     // Param에 넣는 거는 number, 하지만 Query는 무조건 String으로 되기 때문에 Class Transformer 필요
     // () => Number: 첫번째 값을 반환하고 싶은 Type으로 변환 / Class Transformer: Exclude, Expose, Type
     // @Type(() => Number) // http://{{host}}/posts?where__id_more_than=24 -> main.ts에서 transformOptions 사용으로 해결
     @IsNumber()
     @IsOptional()
     where__id_more_than?: number;

     // 정렬
     // createAt -> 생성된 시간의 내림차/오름차 순으로 정렬
     @IsIn(['ASC']) // URL에 리스트값 중 1개가 무조건 있어야 Validation 통과 = 리스트 값들만 허용
     @IsOptional()
     order__createdAt?: 'ASC' = 'ASC'; // main.ts에 transform: true 필요

     // 몇개의 데이터를 응답으로 받을지
     @IsNumber()
     @IsOptional()
     take: number = 20;
}