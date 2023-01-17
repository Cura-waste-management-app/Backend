import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document} from "mongoose";
import { Listing, listingSchema } from "./listing.schema";
// for what??? to form Listing class as a document?
export type userListingsDocument = userListings & Document;

@Schema()
export class userListings {

    // overwriting the default objectID
    @Prop({required: true})
    _id : string;

    @Prop({required: true, type: [listingSchema]})
    listings: Listing[];
}

export const userListingsSchema = SchemaFactory.createForClass(userListings);