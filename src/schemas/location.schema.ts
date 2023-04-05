import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

// for what???// for what??? to form Listing class as a document?
export type locationDocument = Location & Document;

@Schema()
export class Location {

    @Prop({ required: true })
    street: string;

    @Prop({ required: true })
    postalCode: string;

    @Prop({ required: true})
    city: string;

    @Prop({ required: true })
    state: string;

    @Prop({required: true})
    latitude: Number ;

    @Prop({required: true})
    longitude: Number;

}

export const locationSchema = SchemaFactory.createForClass(Location);
