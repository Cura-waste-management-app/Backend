import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";
import { User } from "./user.schema";

export type conversationPubSubDocument = ConversationPubSub & Document;

@Schema()

export class ConversationPubSub
{

    @Prop({required: true, type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    subscribers: ObjectId[]
}

export const ConversationPubSubSchema= SchemaFactory.createForClass(ConversationPubSub);