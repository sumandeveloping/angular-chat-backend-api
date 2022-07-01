import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AddUserDto } from './dto/addUserDto.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  //get all users
  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
  //add a user
  @Post('signup')
  signup(@Body() userDto: AddUserDto): Promise<any> {
    return this.userService.signup(userDto);
  }
  // //login a user
  // @Post('login')
  // async login(@Body() userDto: LoginUserDto): Promise<any> {
  //   // const { email, password } = userDto;
  //   // return await this.userService.login(email, password);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<any> {
    // return req.user;
    return this.authService.loginWithJWT(req.user);
  }
}
