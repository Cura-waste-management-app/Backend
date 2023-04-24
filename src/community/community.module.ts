import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from 'src/schemas/community.schema';
import { User, userSchema } from 'src/schemas/user.schema';
import { JoinedCommunities, JoinedCommunitiesSchema } from 'src/schemas/joined_communities.schema';
import { CommunityMember, CommunityMemberSchema } from 'src/schemas/community_members.schema';
import { Events, EventsSchema } from 'src/schemas/events.schema';
import { EventsService } from 'src/events/events.service';
import { EventsModule } from 'src/events/events.module';
import { EventMembers, EventMembersSchema } from 'src/schemas/eventMembers.schema';
import { JoinedEvents, JoinedEventsSchema } from 'src/schemas/joinedevents.schema';

@Module({
  imports:  [EventsModule, MongooseModule.forFeature([{name: Community.name, schema:CommunitySchema }, {name: User.name, schema: userSchema}, {name : Events.name , schema: EventsSchema},
  {name: JoinedCommunities.name, schema: JoinedCommunitiesSchema}, {name: JoinedEvents.name, schema:JoinedEventsSchema },{name: CommunityMember.name , schema: CommunityMemberSchema},{name: EventMembers.name,schema: EventMembersSchema}])],
  providers: [CommunityService,EventsService],
  controllers: [CommunityController]
})
export class CommunityModule {}
