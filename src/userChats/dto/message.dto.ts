import { IsNotEmpty } from "class-validator";

export class MessageDto{

    @IsNotEmpty() // dto not working without validation decorators
    senderID: String;

    @IsNotEmpty()
    receiverID: String;

    messageContent: String;

    imgURL: String;
    
    @IsNotEmpty()
    timeStamp: String;

}