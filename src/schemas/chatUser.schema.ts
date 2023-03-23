import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

// for what???// for what??? to form Listing class as a document?
export type chatUserDocument = ChatUser & Document;

@Schema()
export class ChatUser {

    @Prop({required: true})
    userID: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    lastMessageID: mongoose.Schema.Types.ObjectId;

}

export const chatUserSchema = SchemaFactory.createForClass(ChatUser);