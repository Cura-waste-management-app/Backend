import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, WebSocketServer } from "@nestjs/websockets/decorators";
import { ObjectExpression } from "mongoose";

@WebSocketGateway() // namespace is to separate this chat gateway from other gateways
export class ChatGateway{

    @WebSocketServer()
    socket;

    @SubscribeMessage('chat') // name of the message we are listening to from client side
    handleMessage(@MessageBody() message:Object): void
    {
        var url = `chat/${message['receiverID']}`;
        console.log(url);
        this.socket.emit(url, JSON.stringify(message));
    }


    
    
}