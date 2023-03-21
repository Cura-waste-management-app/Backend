import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Community } from "./community.schema";
import { User } from "./user.schema";

export type eventDocument = Events & Document;

@Schema()
export class Events
{
    @Prop({required: true})
    name: string;

    @Prop()
    description: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Community'})
    communityId: Community

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    creatorId: User

    @Prop({default: 0})
    totalMembers: Number;
}

export const EventsSchema = SchemaFactory.createForClass(Events);