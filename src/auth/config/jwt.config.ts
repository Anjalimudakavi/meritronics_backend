import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'yourSecretKey',
  expiresIn: '30d',
};

export const jwtConfig: JwtModuleOptions = {
  secret: jwtConstants.secret,
  signOptions: { expiresIn: jwtConstants.expiresIn },
};