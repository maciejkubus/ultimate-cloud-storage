import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpensesTagsService } from '../expenses-tags.service';

@Injectable()
export class ExpensesTagOwnerGuard implements CanActivate {
  constructor(private readonly expensesTagService: ExpensesTagsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const expensesTagId = +request.params.id;
    const userId = request.user.id;

    return this.expensesTagService.isOwner(expensesTagId, userId);
  }
}
