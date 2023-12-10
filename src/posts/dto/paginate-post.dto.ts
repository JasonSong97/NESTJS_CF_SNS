import { IsIn, IsNumber, IsOptional } from "class-validator";

export class paginatePostDto {

     // 이전 마지막 데이터의 ID
     // 이 프로퍼티에 입력된 ID보다 높은 ID 부터 값을 가져오기
     @IsNumber()
     @IsOptional()
     where__id_more_than?: number;

     // 정렬
     // createAt -> 생성된 시간의 내림차/오름차 순으로 정렬
     @IsIn(['ASC']) // URL에 리스트값 중 1개가 무조건 있어야 Validation 통과 = 리스트 값들만 허용
     @IsOptional()
     order__createdAt?: 'ASC' = 'ASC';

     // 몇개의 데이터를 응답으로 받을지
     @IsNumber()
     @IsOptional()
     take: number = 20;
}