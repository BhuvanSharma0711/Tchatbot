import { Body, Controller, Get, Post,Res, } from '@nestjs/common';
import { UserService } from './user.service';
import UserInfoDto from './dto/userinfo.dto';
import ticketinfoDto from './dto/ticketinfo.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post('getinfo')
  getInfo(@Body() body:UserInfoDto) {
    return this.userService.getInfo(body)
  }

  @Post('verify')
  verifyEmail(
    @Body() body: { email: string; token: string },
    @Res({ passthrough: true }) response,
  ) {
    return this.userService.verifyEmail(body,response)
  }

  @Post('book')
  bookTicket(@Body() body : {ticketinfoDto; email:string}) {
    return this.userService.bookTicket(body)
  }
}
