import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly filesService: FilesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const fileId = request.params.id;

    const file = await this.filesService.findOne(+fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    if (file.user.id !== user.id) {
      throw new ForbiddenException(
        "You don't have permission to access this resource",
      );
    }

    return true;
  }
}
