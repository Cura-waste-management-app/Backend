import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from 'src/schemas/community.schema';
import { User, userSchema } from 'src/schemas/user.schema';
import { JoinedCommunities, JoinedCommunitiesSchema } from 'src/schemas/joined_communities.schema';
import { CommunityMember, CommunityMemberSchema } from 'src/schemas/community_members.schema';

@Module({
  imports:  [ MongooseModule.forFeature([{name: Community.name, schema:CommunitySchema }, {name: User.name, schema: userSchema},
  {name: JoinedCommunities.name, schema: JoinedCommunitiesSchema}, {name: CommunityMember.name , schema: CommunityMemberSchema}])],
  providers: [CommunityService],
  controllers: [CommunityController]
})
export class CommunityModule {}
