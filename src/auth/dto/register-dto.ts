import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 32)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 64)
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  files = [];
}
