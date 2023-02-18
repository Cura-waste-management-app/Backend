import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// for what???// for what??? to form Listing class as a document?
export type chatUserDocument = ChatUser & Document;

@Schema()
export class ChatUser {

    @Prop({required: true})
    userID: String;

    @Prop({required: true})
    lastMessageID: String;

}

export const chatUserSchema = SchemaFactory.createForClass(ChatUser);