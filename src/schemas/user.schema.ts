import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document} from "mongoose";
import { Listing } from "./listing.schema";

// for what???// for what??? to form Listing class as a document?
export type userDocument = User & Document;

@Schema()
export class User {

    @Prop({required: true })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    emailID: string;

    @Prop()
    avatarURL: String;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Listing'}]})
    itemsListed: Listing[]; //ids of listings

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Listing'}]})
    itemsRequested: Listing[]; //ids of listings

    @Prop({ default: 0 })
    Points: Number;

}

export const userSchema = SchemaFactory.createForClass(User);