import { IsString } from "class-validator";

export class CreateAddictionDto {
  @IsString()
  title: string;

  @IsString()
  soberDate: string
}
