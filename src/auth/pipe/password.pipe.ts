import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";

// https://docs.nestjs.com/pipes#custom-pipes
@Injectable()
export class PasswordPipe implements PipeTransform {
     /**
      * value : 받는 값
      * metadata : Paramtype(body, query, param), metatype(id: string할때 string 의미), data(@Body('userId')라면 userId)
      */
     transform(value: any, metadata: ArgumentMetadata) {
          if (value.toString().length > 8) {
               throw new BadRequestException('비밀번호는 8자 이하로 입력해주세요!');
          }

          return value.toString();
     }
}