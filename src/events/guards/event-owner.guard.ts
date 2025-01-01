import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { EventsService } from "../events.service";

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(private readonly eventsService: EventsService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const eventId = +request.params.id;
    const userId = request.user.id;

    return this.eventsService.isOwner(eventId, userId);
  }
}