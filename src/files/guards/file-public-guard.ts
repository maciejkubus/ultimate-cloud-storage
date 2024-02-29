import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FilesService } from '../files.service';

@Injectable()
export class FilePublicGuard implements CanActivate {
  constructor(private readonly filesService: FilesService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const fileId = +request.params.id;

    return this.filesService.isFilePublic(fileId);
  }
}
