import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CommunityMember, CommunityMemberSchema } from 'src/schemas/community_members.schema';
import { User, userSchema } from 'src/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JoinedCommunities, JoinedCommunitiesSchema } from 'src/schemas/joined_communities.schema';
import { Community, CommunitySchema } from 'src/schemas/community.schema';
import { Events, EventsSchema } from 'src/schemas/events.schema';
import { EventMembers, EventMembersSchema } from 'src/schemas/eventMembers.schema';
import { JoinedEvents, JoinedEventsSchema } from 'src/schemas/joinedevents.schema';

@Module({
  imports:  [ MongooseModule.forFeature([{name: Community.name, schema:CommunitySchema }, {name: User.name, schema: userSchema},
    {name: JoinedCommunities.name, schema: JoinedCommunitiesSchema}, {name: CommunityMember.name , schema: CommunityMemberSchema}, {name: Events.name, schema: EventsSchema},
  {name: EventMembers.name,schema: EventMembersSchema}, {name: JoinedEvents.name, schema:JoinedEventsSchema }])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
