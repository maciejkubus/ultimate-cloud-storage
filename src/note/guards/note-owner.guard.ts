import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { NoteService } from '../note.service';

@Injectable()
export class NoteOwnerGuard implements CanActivate {
  constructor(private readonly noteService: NoteService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const noteId = +request.params.id;
    const userId = request.user.id;

    return this.noteService.isNoteOwner(noteId, userId);
  }
}
