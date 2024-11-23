import { PartialType } from '@nestjs/swagger';
import { CreateExpensesTagDto } from './create-expenses-tag.dto';

export class UpdateExpensesTagDto extends PartialType(CreateExpensesTagDto) {}
