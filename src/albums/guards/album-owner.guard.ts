import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AlbumsService } from '../albums.service';

@Injectable()
export class AlbumOwnerGuard implements CanActivate {
  constructor(private readonly albumsService: AlbumsService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const albumId = +request.params.id;
    const userId = request.user.id;

    return this.albumsService.isAlbumOwner(albumId, userId);
  }
}
