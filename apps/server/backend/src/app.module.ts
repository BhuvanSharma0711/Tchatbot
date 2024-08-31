import { Module,Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import Redis from 'ioredis';

@Module({
  imports: [UserModule,PrismaModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'REDIS',
      useFactory: () => {
        const client = new Redis(process.env.REDDIS_URL);
        client.on('error', (err) => console.error('Redis error', err));
        return client;
      },
      scope: Scope.DEFAULT,
    },
  ],
})
export class AppModule {}
