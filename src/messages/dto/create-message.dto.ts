import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  text: string;
}
