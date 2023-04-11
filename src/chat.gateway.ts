import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, WebSocketServer } from "@nestjs/websockets/decorators";

@WebSocketGateway() // namespace is to separate this chat gateway from other gateways
export class ChatGateway {

    @WebSocketServer()
    socket;

    @SubscribeMessage('chat') // name of the message we are listening to from client side
    handleMessage(@MessageBody() message:Object): void {

        console.log("sending message to ", message['receiverId']);
        var url = `chat/${message['receiverId']}`;

        this.socket.emit(url, JSON.stringify(message));
    }


}