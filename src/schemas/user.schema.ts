import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document} from "mongoose";
import { Listing } from "./listing.schema";
import {Location} from "./location.schema";

// for what???// for what??? to form Listing class as a document?
export type userDocument = User & Document;

@Schema()
export class User {

    @Prop({required: true })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Location'})
    location: Location

    @Prop()
    emailID: string;

    @Prop()
    avatarURL: string;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Listing'}]})
    itemsLiked: Listing[];

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Listing'}]})
    itemsListed: Listing[]; //ids of listings

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Listing'}]})
    itemsRequested: Listing[]; //ids of listings

    @Prop({ default: 0 })
    itemsShared: number;

    @Prop({ default: 0 })
    itemsReceived: number;

    @Prop({ default: 0 })
    Points: number;

}

export const userSchema = SchemaFactory.createForClass(User);
userSchema.index({name:1}, {unique: true});