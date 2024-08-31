import { Module,Scope } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserService,ConfigService,
    {
      provide: 'REDIS',
      useFactory: () => {
        const client = new Redis(process.env.REDDIS_URL);
        client.on('error', (err) => console.error('Redis error', err));
        return client;
      },
      scope: Scope.DEFAULT,
    }
  ],
  exports: [UserService, ConfigService],
})
export class UserModule {}
