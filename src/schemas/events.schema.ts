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
    creatorId: mongoose.Schema.Types.ObjectId

    @Prop({default: 0})
    totalMembers: number;

    @Prop()
    imgURL: string;
    
    @Prop({required: true})
    location: string;

    @Prop()
    postTime:Date;
    

    // @Prop({required: true})
    // timestamp: Date;


}

export const EventsSchema = SchemaFactory.createForClass(Events);