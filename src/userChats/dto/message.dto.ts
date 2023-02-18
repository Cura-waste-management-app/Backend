import { IsNotEmpty } from "class-validator";

export class MessageDto{

    @IsNotEmpty() // dto not working without validation decorators
    senderID: String;

    @IsNotEmpty()
    receiverID: String;

    @IsNotEmpty()
    messageContent: String;

    @IsNotEmpty()
    imgURL: String;
    
    @IsNotEmpty()
    timeStamp: String;

}