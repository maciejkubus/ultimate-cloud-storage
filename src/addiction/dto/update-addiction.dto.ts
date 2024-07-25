import { PartialType } from '@nestjs/swagger';
import { CreateAddictionDto } from './create-addiction.dto';

export class UpdateAddictionDto extends PartialType(CreateAddictionDto) {}
