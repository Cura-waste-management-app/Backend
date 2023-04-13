import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { Document } from "mongoose";


// for what???// for what??? to form Listing class as a document?
export type messageDocument = Message & Document;

@Schema()
export class Message {

    @Prop({required: true})

    senderId: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    receiverId: mongoose.Schema.Types.ObjectId;

    @Prop({required: true,type: mongoose.Schema.Types.Mixed })
    content: Object;


    @Prop({required: true})
    createdAt: Number;

}

export const messageSchema = SchemaFactory.createForClass(Message);