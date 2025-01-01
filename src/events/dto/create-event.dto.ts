import { IsDate, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  type: 'event' | 'task';

  @IsDate()
  start: Date;

  @IsDate()
  @IsOptional()
  end?: Date;
}