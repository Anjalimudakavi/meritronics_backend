import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service'; 
import { JwtPayload } from './payload-interface/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { PasswordHelper } from 'src/common/helpers/password-helper';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authorizationService: AuthorizationService,
  ) {}

  //user login
async login(email: string, password: string) {
  const user = await this.userService.getUserByEmail(email);
  if (!user) throw new UnauthorizedException('Invalid credentials');

  const isPasswordValid = await PasswordHelper.validatePassword(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    sub: user.id, 
    roleId: user.roleId,
     role: user.employee.role?.name  , 
  };

  const accessToken = this.jwtService.sign(payload);
  const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

  // Hash and store the refresh token
  const hashedRefreshToken = await PasswordHelper.hashPassword(refreshToken);
  await this.userService.updateUser(user.id, { refreshToken: hashedRefreshToken });

  return { accessToken, refreshToken,  username: user.username, designation: user.employee?.designation
        ? {
            id: user.employee.designation.id,
            title: user.employee.designation.title,
            isActive: user.employee.designation.isActive,
            departmentId: user.employee.designation.departmentId,
             permissions: user.employee.designation.permissions.map((p) => ({
          id: p.permission.id,
          name: p.permission.name,
          description: p.permission.description,
        })),
      }
        : null,};
}

//validate user
async validateUser(email: string, password: string) {
  const user = await this.userService.getUserByEmail(email);
  if (user?.password && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;
}

  // Request password reset
  async requestPasswordReset(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const resetToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '15m' });

    // TODO: Send the resetToken via email
    console.log(`Password reset token for ${email}: ${resetToken}`);
    return { message: 'Password reset email sent', resetToken };
  }

  // Reset the password
  async resetPassword(resetToken: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(resetToken);
      const user = await this.userService.getUserById(payload.sub);
      console.log("User fetched in refreshToken:", user); 

      if (!user) throw new UnauthorizedException('Invalid token');

      const hashedPassword = await PasswordHelper.hashPassword(newPassword);
      await this.userService.updateUser(user.id, { password: hashedPassword });
      return { message: 'Password successfully reset' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  // Refresh the access token
  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException('Invalid refresh token');

    const isTokenValid = await PasswordHelper.validatePassword(refreshToken, user.refreshToken);
    if (!isTokenValid) throw new UnauthorizedException('Invalid refresh token');

    if (!user.roleId) {
  throw new UnauthorizedException('User has no valid role');
}
  // Revalidate role and permissions dynamically
    const rolePermissions = await this.authorizationService.getPermissionsForRole(user.roleId);
    if (!rolePermissions || rolePermissions.length === 0) {
      throw new UnauthorizedException('User has no valid role or permissions');
    }

    const newAccessToken = this.jwtService.sign({
    userId: user.id,
    email: user.email,
    sub: user.id, 
    roleId: user.roleId,
    role: user?.role?.name , 
    });

    return { accessToken: newAccessToken };
  }
}