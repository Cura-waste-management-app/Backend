import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";


// for what???// for what??? to form Listing class as a document?
export type messageDocument = Message & Document;

@Schema()
export class Message {

    @Prop({required: true})

    senderID: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    receiverID: mongoose.Schema.Types.ObjectId;

    @Prop()
    messageContent: String;

    @Prop()
    imgURL: String;

    @Prop({required: true})
    timeStamp: String;

}

export const messageSchema = SchemaFactory.createForClass(Message);