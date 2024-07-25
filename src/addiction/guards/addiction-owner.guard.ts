import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AddictionService } from '../addiction.service';

@Injectable()
export class AddictionOwnerGuard implements CanActivate {
  constructor(private readonly addictionService: AddictionService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const noteId = +request.params.id;
    const userId = request.user.id;

    return this.addictionService.isAddictionOwner(noteId, userId);
  }
}
