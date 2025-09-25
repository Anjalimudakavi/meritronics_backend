import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../payload-interface/jwt-payload.interface';


import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
   super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKey: process.env.JWT_SECRET_KEY!, 
});

  }


async validate(payload: JwtPayload) {
  return {
    userId: payload.userId,
    email: payload.email,
    roleId: payload.roleId,
    role: {
      id: payload.roleId,
      name: payload.role,
    },
  };
}


}