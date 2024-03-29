import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserListingsModule } from './userListings/userListings.module';
import { UserRequestsModule } from './userRequests/userRequests.module';
import { HomeListingsModule } from './homeListings/homeListings.module';

import { UserChatsModule } from './userChats/userChats.module';

import { AuthModule } from './auth/auth.module';
import { PreauthMiddleware } from './auth/preauth.middleware';

import { CommunityModule } from './community/community.module';
import { EventsModule } from './events/events.module';
import { UserModule } from './user/user.module';

// application will crash if mongodb server is down, how to handle that ???
@Module({
  imports: [ConfigModule.forRoot(),
  MongooseModule.forRoot(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cura.plqaydm.mongodb.net/curaApp?retryWrites=true&w=majority`
  ),
  UserModule,
  UserListingsModule,
  UserRequestsModule,
  HomeListingsModule,

  UserChatsModule,

  AuthModule,
  CommunityModule,
  EventsModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
 }
