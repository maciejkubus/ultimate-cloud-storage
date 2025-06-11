import { IsString, Length } from "class-validator";

export class CreateEmotionDto {
  @IsString()
  name: string;

  @IsString()
  @Length(1, 1)
  emoticon: string;
}
