import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateNoteDto {
  @IsString()
  @ApiProperty({
    example: 'Sample text',
  })
  content: string;
}
