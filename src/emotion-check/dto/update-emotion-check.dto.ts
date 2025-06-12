import { PartialType } from '@nestjs/swagger';
import { CreateEmotionCheckDto } from './create-emotion-check.dto';

export class UpdateEmotionCheckDto extends PartialType(CreateEmotionCheckDto) {}
