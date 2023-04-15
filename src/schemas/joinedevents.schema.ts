import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
import { Events } from "./events.schema";

export type joinedEventsDocument = JoinedEvents & Document

@Schema()

export class JoinedEvents
{
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: User
    @Prop({required: true, type: mongoose.Schema.Types.String})
    uniqueId: String
    @Prop({required: true, type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Events'}]})
    joinedevents: Events[]


}

export const JoinedEventsSchema = SchemaFactory.createForClass(JoinedEvents);
JoinedEventsSchema.index({ uniqueId: 1 }, { unique: true });