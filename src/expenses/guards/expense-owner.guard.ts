import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExpensesService } from '../expenses.service';

@Injectable()
export class ExpenseOwnerGuard implements CanActivate {
  constructor(private readonly expenseService: ExpensesService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const expenseId = +request.params.id;
    const userId = request.user.id;

    return this.expenseService.isOwner(expenseId, userId);
  }
}
