import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddUserDto } from './dto/addUserDto.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  public async getUsers(): Promise<User[]> {
    return await this.userRepository.find({ order: { createdAt: 'DESC' } });
  }

  public async signup(userDto: AddUserDto): Promise<any> {
    const findEmail: User[] = await this.userRepository.find({
      where: { email: userDto.email },
    });
    //check if email already exists
    if (findEmail.length > 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Email already exists! Please try another email',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const user = new User();
      for (const [key, value] of Object.entries(userDto)) {
        user[key] = value;
        if (key === 'password') {
          //hash it
          user[key] = await this.hashPassword(value);
        }
      }
      const newUser = await this.userRepository.save(user);
      const token = await this.generateToken(newUser.id, newUser.username);
      return { ...newUser, token };
    }
  }
  //hash hashPassword
  private async hashPassword(password: string): Promise<string> {
    try {
      const salt = 8;
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.log(error.stack);
      console.log(error.message);
    }
  }
  //generate Token (expiresin 1 Hour)
  private async generateToken(id: string, username: string): Promise<string> {
    return await jwt.sign({ id, username }, 'secretKey', {
      expiresIn: '1h',
    });
  }
  public async validatePassword(
    userPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(userPassword, dbPassword);
  }
  public async validateUser(email: string, password: string): Promise<any> {
    //check email
    const user: User = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'password'],
    });
    //checkreturn user;
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    //check password is valid
    if (user && (await this.validatePassword(password, user.password))) {
      //return validated user
      const validatedUser = { id: user.id, username: user.username };
      return validatedUser;
    } else {
      //user is invalid
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Credential mismatch! Please check your credentials again',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check password
  }
  public async login(email: string, password: string): Promise<any> {
    //check email
    const user: User = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'password'],
    });
    //checkreturn user;
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    // return user;
    if (user && (await this.validatePassword(password, user.password))) {
      //user is valid so generate token
      return user;
      const username = user.username;
      const token = await this.generateToken(user.id, username);
      return { username, token };
    } else {
      //user is invalid
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Credential mismatch! Please check your credentials again',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    //check password
  }
}
