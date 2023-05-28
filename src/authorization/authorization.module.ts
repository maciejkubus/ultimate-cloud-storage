import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';

@Module({
  imports: [],
  providers: [AuthorizationService],
})
export class AuthorizationModule {}
