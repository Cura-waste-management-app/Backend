import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { UserChatsController } from './userChats.controller';
import { ChatService } from './userChats.services';

@Module({
    imports: [],
    controllers: [UserChatsController],
    providers: [ChatService],
})
export class UserChatsModule { }
