import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document} from "mongoose";

// for what???// for what??? to form Listing class as a document?
export type uciDocument = UCI & Document;

@Schema()
export class UCI {

    @Prop({required: true })
    entityName: string;

    @Prop({required: true})
    uciCode: string

}

export const uciSchema = SchemaFactory.createForClass(UCI);