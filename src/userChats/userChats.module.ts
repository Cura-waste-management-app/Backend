import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import { ChatUser, chatUserSchema } from 'src/schemas/chatUser.schema';
import { ConversationPartner, ConversationPartnerSchema } from 'src/schemas/conversationPartner.schema';
import { Message, messageSchema } from 'src/schemas/message.schema';
import { UserChatsController } from './userChats.controller';
import { ChatService } from './userChats.services';

@Module({
    imports: [MongooseModule.forFeature([{ name: Message.name, schema: messageSchema }, {name: ConversationPartner.name, schema: ConversationPartnerSchema},
    {name: ChatUser.name, schema: chatUserSchema}])],
    controllers: [UserChatsController],
    providers: [ChatService],
})
export class UserChatsModule { }
