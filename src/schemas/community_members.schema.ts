import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Community } from "./community.schema";
import { User } from "./user.schema";

export type CommunityMemberDocument = CommunityMember & Document;

@Schema()
export class CommunityMember
{
    // @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Community'})
    // communityId: Community;

    @Prop({type: [{type : mongoose.Schema.Types.ObjectId, ref: 'Users'}]})
    members: User[]

    



}

export const CommunityMemberSchema = SchemaFactory.createForClass(CommunityMember);