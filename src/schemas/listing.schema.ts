import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// for what???// for what??? to form Listing class as a document?
export type listingDocument = Listing & Document;

@Schema()
export class Listing {

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    postDate: Date;

    @Prop()
    sharedDate: Date;

    @Prop({ required: true })
    status: string;

    @Prop({ required: true })
    imgURL: string;

    @Prop({ default: 0 })
    requests: Number;

    @Prop({ default: 0 })
    views: Number;

    @Prop({ default: 0 })
    likes: Number;

}

export const listingSchema = SchemaFactory.createForClass(Listing);