import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;

  @IsDate()
  @IsOptional()
  created: Date;

  @IsDate()
  @IsOptional()
  updated: Date;
}
