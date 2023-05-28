import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationService } from '../authenticationservice';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly AuthenticationService: AuthenticationService) {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      signOptions: { expiresIn: jwtExpiresIn },
    });
  }

  async validate(payload: { id: number; iat: number; exp: number }) {
    return { id: payload.id };
  }
}
