import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId } from "mongoose";

// for what???// for what??? to form Listing class as a document?
export type userDocument = User & Document;

@Schema()
export class User {

    // @Prop({ required: true })
    // _id: ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    emailID: string;

    @Prop({type: [String]})
    itemsListed: string[]; //ids of listingss

    @Prop({type: [String]})
    itemsRequested: string[];

    @Prop({ default: 0 })
    Points: Number;

}

export const userSchema = SchemaFactory.createForClass(User);