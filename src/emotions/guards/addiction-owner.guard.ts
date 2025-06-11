import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EmotionsService } from '../emotions.service';

@Injectable()
export class EmotionOwnerGuard implements CanActivate {
  constructor(private readonly emotionsService: EmotionsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const emotionId = +request.params.id;
    const userId = request.user.id;

    return this.emotionsService.isEmotionOwner(emotionId, userId);
  }
}
