import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ChatUser, chatUserSchema } from 'src/schemas/chatUser.schema';
import { Message, messageSchema } from 'src/schemas/message.schema';
import { UserChatsController } from './userChats.controller';
import { ChatService } from './userChats.services';

@Module({
    imports: [MongooseModule.forFeature([{ name: Message.name, schema: messageSchema }, 
    {name: ChatUser.name, schema: chatUserSchema}])],
    controllers: [UserChatsController],
    providers: [ChatService],
})
export class UserChatsModule { }
