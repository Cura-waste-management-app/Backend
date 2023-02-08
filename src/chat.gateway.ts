import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { MessageBody, WebSocketServer } from "@nestjs/websockets/decorators";

@WebSocketGateway() // namespace is to separate this chat gateway from other gateways
export class ChatGateway{

    @WebSocketServer()
    socket;

    @SubscribeMessage('message') // name of the message we are listening to from client side
    handleMessage(@MessageBody() message: string): void
    {
        console.log(message);
        this.socket.emit('message', message);
    }
    
    
}