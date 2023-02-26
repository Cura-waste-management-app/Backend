import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "./user.schema";
import { Community } from "./community.schema";


export type joinedCommunitiesDocument = JoinedCommunities & Document
@Schema()
export class JoinedCommunities
{

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    userId: User

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Community'})
    joinedCommunities: Community[]


}

export const JoinedCommunitiesSchema = SchemaFactory.createForClass(JoinedCommunities);

