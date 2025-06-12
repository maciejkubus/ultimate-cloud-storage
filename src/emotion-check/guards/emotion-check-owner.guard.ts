import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EmotionChecksService } from '../emotion-check.service';

@Injectable()
export class EmotionCheckGuard implements CanActivate {
  constructor(private readonly emotionChecksService: EmotionChecksService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const emotionCheckId = +request.params.id;
    const userId = request.user.id;

    return this.emotionChecksService.isEmotionCheckOwner(emotionCheckId, userId);
  }
}