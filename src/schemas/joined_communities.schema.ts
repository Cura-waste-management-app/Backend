import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
import { Community } from "./community.schema";


export type joinedCommunitiesDocument = JoinedCommunities & Document
@Schema()
export class JoinedCommunities
{

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    _id: User

    @Prop({required: true, type:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Community'}]})
    joinedCommunities: Community[]

    // @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Listing'}]})
    // itemsListed: Listing[]; //ids of listings

}

export const JoinedCommunitiesSchema = SchemaFactory.createForClass(JoinedCommunities);

