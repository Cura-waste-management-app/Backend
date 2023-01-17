import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserListingsModule } from './userListings/userListings.module';

// application will crash if mongodb server is down, how to handle that ???
@Module({
  imports: [ConfigModule.forRoot(),
  MongooseModule.forRoot(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cura.plqaydm.mongodb.net/curaApp?retryWrites=true&w=majority`
  ),
  UserListingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
