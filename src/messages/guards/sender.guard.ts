import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessagesService } from '../messages.service';

@Injectable()
export class SenderGuard implements CanActivate {
  constructor(private readonly messagesService: MessagesService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const msgId = +request.params.id;
    const userId = request.user.id;

    return this.messagesService.isSender(msgId, userId);
  }
}
