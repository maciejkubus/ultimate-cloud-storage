import { IsBoolean, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateExpenseDto {
  @IsString()
  @Length(3, 24)
  name: string;

  @IsString()
  @Length(0, 60)
  @IsOptional()
  description?: string

  @IsNumber()
  @Min(0)
  amount: number;

  @IsBoolean()
  @IsOptional()
  isTransactionOut?: boolean;
}