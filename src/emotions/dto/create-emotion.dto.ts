import { IsString } from "class-validator";

export class CreateEmotionDto {
  @IsString()
  name: string;

  @IsString()
  emoticon: string;
}
