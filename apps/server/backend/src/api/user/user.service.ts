import { ForbiddenException, Injectable } from '@nestjs/common';
import UserInfoDto from './dto/userinfo.dto'

@Injectable()
export class UserService {
  getHello(): string {
    return 'Hello World in user!';
  }

  async getName(body:UserInfoDto) {
    const { name, UID_type, UID, email } = body;
    if(!name || !UID_type || !UID || !email) {
      throw new ForbiddenException('Missing required fields');
    }
  }
}
