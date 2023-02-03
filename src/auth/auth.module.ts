import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PreauthMiddleware } from './preauth.middleware';
import path from 'path';

@Module({
    imports: [],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(PreauthMiddleware).forRoutes({path: '*', method: RequestMethod.ALL}
            
        );  
    }

}
