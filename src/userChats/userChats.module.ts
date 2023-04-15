import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatUser, chatUserSchema } from 'src/schemas/chatUser.schema';
import { ConversationPartner, ConversationPartnerSchema } from 'src/schemas/conversationPartner.schema';
import { ConversationPubSub, ConversationPubSubSchema } from 'src/schemas/conversation_pubsub.schema';
import { Message, messageSchema } from 'src/schemas/message.schema';
import { User, userSchema } from 'src/schemas/user.schema';
import { ChatGateway } from './chat.gateway';
import { UserChatsController } from './userChats.controller';
import { ChatService } from './userChats.services';

@Module({
    imports: [MongooseModule.forFeature([{ name: Message.name, schema: messageSchema }, { name: ConversationPartner.name, schema: ConversationPartnerSchema }, { name: User.name, schema: userSchema }, { name: ConversationPubSub.name, schema: ConversationPubSubSchema },
    { name: ChatUser.name, schema: chatUserSchema }])],
    controllers: [UserChatsController],
    providers: [ChatService, ChatGateway],
})
export class UserChatsModule { }
