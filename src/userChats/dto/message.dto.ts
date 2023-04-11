import { IsNotEmpty } from "class-validator";

export class MessageDto{

    @IsNotEmpty() // dto not working without validation decorators
    senderId: String;

    @IsNotEmpty()
    receiverId: String;
    
    @IsNotEmpty()
    content : Object;

    // messageContent: String;

    // uri: String;
    
    @IsNotEmpty()
    createdAt: Number;

    // @IsNotEmpty()
    // type: String;
    
    // text: String;

    // size : Number;

    // name : String
    
}