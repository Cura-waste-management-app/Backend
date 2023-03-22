import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, communityDocument } from 'src/schemas/community.schema';
import { CommunityMember, CommunityMemberDocument } from 'src/schemas/community_members.schema';
import { JoinedCommunities, joinedCommunitiesDocument } from 'src/schemas/joined_communities.schema';
import { User, userDocument } from 'src/schemas/user.schema';

@Injectable()
export class EventsService {
    constructor(@InjectModel(Community.name) private communityModel: Model<communityDocument>,  @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(CommunityMember.name) private communityMemberModel: Model<CommunityMemberDocument>, @InjectModel(JoinedCommunities.name) private joinedCommunitiesModel: Model<joinedCommunitiesDocument>)
    {    }
}
