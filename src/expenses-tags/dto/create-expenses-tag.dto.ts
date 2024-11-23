import { IsHexColor, IsString, Length } from "class-validator";

export class CreateExpensesTagDto {
  @IsString()
  @Length(1, 16)
  name: string;

  @IsString()
  @IsHexColor()
  @Length(7, 7)
  color: string;
}
