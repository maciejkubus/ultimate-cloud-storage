import { IsNumber } from "class-validator";

export class CreateEmotionCheckDto {
  @IsNumber()
  day: number;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsNumber()
  hour: number;

  @IsNumber()
  minute: number;
}
