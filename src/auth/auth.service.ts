import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  public async validateUser(email: string, password: string) {
    return await this.userService.validateUser(email, password);
  }
  async loginWithJWT(user: { id: string | number; username: string }) {
    const payload = { ...user };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
