import { ForbiddenException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import UserInfoDto from './dto/userinfo.dto'
import sendEmail from 'src/handlers/email.global';
import Redis from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';
import handleErrors from 'src/handlers/handleErrors.global';

@Injectable()
export class UserService {
  constructor (
    private prisma: PrismaService,
    @Inject('REDIS') private redisClient: Redis,
  ) {}

  getHello(): string {
    return 'Hello World in user!';
  }
  
  async sendVerificationCode(
    email: string,
    subject: string,
    text: string,
  ): Promise<boolean> {
    try {
      const res = await sendEmail(email, subject, text);
      return res;
    } catch (error) {
      return false;
    }
  }

  async getInfo(body:UserInfoDto) {

    const { name, UID_type, UID, email } = body;

    if(!name || !UID_type || !UID || !email) {
      throw new ForbiddenException('Missing required fields');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw new ForbiddenException('Invalid email format');
    }

    let user = await this.prisma.user
    .create({
      data: {
        name,
        email,
        UID_type,
        UID,
      },
    })
    .catch((error) => {
      handleErrors(error);
    });

    const verificationCode = Math.random().toString(8).substring(2);

    try {
      await this.redisClient.set(email, verificationCode);
    } catch (error) {
      return error;
    } finally {
      const subject = 'Email Verification';
      const text = `Your verification code is ${verificationCode}`;
      await this.sendVerificationCode(email, subject, text);
    }
  }

  async verifyEmail(body: { email: string; token: string }, response) {
    const verificationCode = await this.redisClient.get(body.email);

    if (verificationCode !== body.token) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    await this.redisClient.del(body.email);

    let user = await this.prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        isVerified: true,
      },
    });
  }
}
