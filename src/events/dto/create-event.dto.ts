import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  type: 'event' | 'task';

  @IsString()
  color: string;

  @IsDateString()
  start: Date | string;

  @IsDateString()
  @IsOptional()
  end?: Date | string;
}
