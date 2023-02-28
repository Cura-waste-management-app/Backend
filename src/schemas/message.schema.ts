import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// for what???// for what??? to form Listing class as a document?
export type messageDocument = Message & Document;

@Schema()
export class Message {

    @Prop({required: true})
    senderID: String;

    @Prop({required: true})
    receiverID: String;

    @Prop({required: true})
    messageContent: String;

    @Prop({required: true})
    imgURL: String;

    @Prop({required: true})
    timeStamp: String;

}

export const messageSchema = SchemaFactory.createForClass(Message);