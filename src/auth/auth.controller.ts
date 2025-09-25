import { Controller, Post, Body,Get ,Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto'; // You'll need a DTO for the login request

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //user login
   @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }
  
//request password
  @Post('request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    return await this.authService.requestPasswordReset(body.email);
  }

  //reset password
  @Post('reset-password')
  async resetPassword(
    @Body() body: { resetToken: string; newPassword: string },
  ) {
    return await this.authService.resetPassword(body.resetToken, body.newPassword);
  }

  //refresh access token
  @Post('refresh-token')
  async refreshToken(@Body() body: { userId: string; refreshToken: string }) {
    return await this.authService.refreshToken(body.userId, body.refreshToken);
  }

  //user logout
  @Post('logout')
async logout(): Promise<{ message: string }> {
  return { message: 'Logged out successfully' };
}

}