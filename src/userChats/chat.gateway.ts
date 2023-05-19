import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, WebSocketServer } from "@nestjs/websockets/decorators";
import { Model } from "mongoose";
import { ConversationPubSub, conversationPubSubDocument } from "src/schemas/conversation_pubsub.schema";

@Injectable()
@WebSocketGateway()
// namespace is to separate this chat gateway from other gateways
export class ChatGateway {
    constructor(@InjectModel(ConversationPubSub.name) private conversationPubSubModel: Model<conversationPubSubDocument>) { }
    @WebSocketServer()
    socket;
    @SubscribeMessage('subscribe')
    async handleSubscribe(@MessageBody() data: Object) {
        await this.conversationPubSubModel.findByIdAndUpdate(data['groupId'], { $addToSet: { subscribers: data['userId'] } }, { upsert: true }); 
    }
    @SubscribeMessage('unsubscribe')
    async handleUnsubscribe(@MessageBody() data: Object) {
        const updatedConversation = await this.conversationPubSubModel.findByIdAndUpdate(data['groupId'], { $pull: { subscribers: data['userId'] } }, { new: true, select: 'subscribers' });
        if (!updatedConversation || updatedConversation.subscribers.length === 0) {
            await this.conversationPubSubModel.deleteOne({ groupId: data['groupId'] });
    }
}

@SubscribeMessage('groupChat') // name of the message we are listening to from client side
    async handleGroupMessage(@MessageBody() message: Object) {
        
    // console.log("groupchat ",message );
    const conversation=await this.conversationPubSubModel.findById(message['receiverId'],'subscribers');
    conversation.subscribers.forEach((connectionId)=>{
        if(connectionId!=message['senderId']){
            var url = `chat/${connectionId}`;
            // console.log("sending message to ",url);
            this.socket.emit(url,JSON.stringify(message));
        }

    });
   
   

    // this.socket.emit(url, JSON.stringify(message));
}

    @SubscribeMessage('chat') // name of the message we are listening to from client side
    handleMessage(@MessageBody() message: Object): void {

        // console.log("sending message to ", message['receiverId']);
        var url = `chat/${message['receiverId']}`;

        this.socket.emit(url, JSON.stringify(message));
    }

   


}