import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
import { Events } from "./events.schema";

export type eventMembersDocument = EventMembers & Document;

@Schema()

export class EventMembers
{
    // @Prop({required: true , type: mongoose.Schema.Types.ObjectId, ref: 'Events'})
    // eventId: Events

    @Prop({required: true, type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}]})
    members: User[]
}

export const EventMembersSchema= SchemaFactory.createForClass(EventMembers);