import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document} from "mongoose";

// for what???// for what??? to form Listing class as a document?
export type firebaseUidDocument = FirebaseUID & Document;

@Schema()
export class FirebaseUID {

    @Prop({required: true })
    _id: string;

    @Prop({required: true})
    mongooseUID: mongoose.Schema.Types.ObjectId;

}

export const firebaseUidSchema = SchemaFactory.createForClass(FirebaseUID);