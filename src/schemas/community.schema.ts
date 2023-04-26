import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
import { Events } from "./events.schema";


export type communityDocument = Community & Document;

@Schema()
export class Community
{
    @Prop({ required: true})
    name: string;

    @Prop()
    description: string;

    @Prop({required: true})
    category: string;

    @Prop({required: true})
    location: string;

    @Prop({default: 0})
    totalParticipant: number;


    @Prop({ required: true })
    imgURL: string;

    @Prop()
    members: string

    // @Prop({type: [{types: mongoose.Schema.Types.ObjectId, ref: 'Events'}]})
    // events: Events[]

    @Prop({ type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Events'}]})
    events: mongoose.Schema.Types.ObjectId[]


    // @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    // user: User[];

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    adminId : User

    @Prop({required: true})
    type: string

}

export const CommunitySchema = SchemaFactory.createForClass(Community);