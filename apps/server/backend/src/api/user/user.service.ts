import { ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World in user!';
  }

  async getName(body:{username:string}) {
    if (!username) {
      throw new ForbiddenException('Missing required fields');
    }
  }
}
