import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "./user.schema";
import { Location } from "./location.schema";

// for what???// for what??? to form Listing class as a document?
export type listingDocument = Listing & Document;

@Schema()
export class Listing {

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true})
    postTimeStamp: Date;

    @Prop() // when the item was shared with an user
    sharedTimeStamp: Date;

    @Prop({ required: true })
    status: string;

    @Prop({required: true, type:mongoose.Schema.Types.ObjectId, ref: 'User'})
    owner: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Location'})
    location: Location;

    @Prop({ required: true })
    imagePath: string;

    @Prop({ default: 0 })
    requests: number;

    @Prop({ default: 0 })
    likes: number;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    requestedUsers: User[]; 

    @Prop({type:mongoose.Schema.Types.ObjectId})
    sharedUserID: mongoose.Schema.Types.ObjectId;

}

export const listingSchema = SchemaFactory.createForClass(Listing);
listingSchema.index({'location.city' :1});