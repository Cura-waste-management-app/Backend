import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";
import { Community } from "./community.schema";
import { User } from "./user.schema";

export type ConversationPartnerDocument = ConversationPartner & Document;

@Schema()
export class ConversationPartner
{
    
    @Prop({type: [{type : mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    usersList: ObjectId[]

}

export const ConversationPartnerSchema = SchemaFactory.createForClass(ConversationPartner);