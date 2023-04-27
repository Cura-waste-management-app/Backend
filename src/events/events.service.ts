import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose, ObjectId } from 'mongoose';
import { Community, communityDocument } from 'src/schemas/community.schema';
import { CommunityMember, CommunityMemberDocument } from 'src/schemas/community_members.schema';
import { EventMembers, eventMembersDocument } from 'src/schemas/eventMembers.schema';
import { Events, eventDocument } from 'src/schemas/events.schema';
import { JoinedCommunities, joinedCommunitiesDocument } from 'src/schemas/joined_communities.schema';
import { User, userDocument } from 'src/schemas/user.schema';
import { EventsDto } from './dto/events.dto';
import { JoinedEvents, joinedEventsDocument } from 'src/schemas/joinedevents.schema';
import { createHash } from 'crypto';
import { ConversationPubSub, conversationPubSubDocument } from 'src/schemas/conversation_pubsub.schema';
// import  createHash  from 'crypto'
@Injectable()
export class EventsService {
    constructor(@InjectModel(Community.name) private communityModel: Model<communityDocument>, @InjectModel(User.name) private userModel: Model<userDocument>, @InjectModel(ConversationPubSub.name) private conversationPubSubModel: Model<conversationPubSubDocument>,
        @InjectModel(CommunityMember.name) private communityMemberModel: Model<CommunityMemberDocument>, @InjectModel(JoinedCommunities.name) private joinedCommunitiesModel: Model<joinedCommunitiesDocument>,
        @InjectModel(Events.name) private eventsmodel: Model<eventDocument>, @InjectModel(EventMembers.name) private eventmembersmodel: Model<eventMembersDocument>,
        @InjectModel(JoinedEvents.name) private joinedeventsmodel: Model<joinedEventsDocument>) { }

    async addNewEvent(dto: EventsDto, communityId: ObjectId, creatorId: string): Promise<any> {
        const community = await this.communityMemberModel.findById(communityId);
        console.log(community);
        const creator = await this.userModel.findById(new mongoose.Types.ObjectId(creatorId));
        console.log(creator);


        const isMemberExistInCommunity = await this.communityMemberModel.findOne({ _id: communityId, members: { $in: [creator._id] } })
        console.log("hei")
        console.log(isMemberExistInCommunity)


        //  const members =  community.members;
        //  console.log(members);       

        if (!community) {
            throw new Error(`community with id ${communityId} not found`)

        }

        if (!creator) {
            throw new Error(`creator with id ${creatorId} not found`)
        }

        if (!isMemberExistInCommunity) {
            throw new Error(`User with id ${creatorId} has not joined the community ${communityId}`)
        }

        else {
            const data = {
                name: dto.name,
                description: dto.description,
                totalMembers: 1,
                location: dto.location,
                imgURL: dto.imgURL,
                communityId: community,
                creatorId: creator,
                postTime: new Date()

            }
            try {
                const event = await new this.eventsmodel(data).save();
                // const output = createId(communityId, creatorId)
                const output = creatorId + communityId;
                const user_exist = await this.joinedeventsmodel.exists({ uniqueId: output })
                const data2 = {
                    uniqueId: output,
                    userId: creatorId,
                    joinedevents: [event._id]
                }


                const data1 = {
                    _id: event._id,
                    members: [creator._id]
                }
                await new this.eventmembersmodel(data1).save()
                // await this.joinedeventsmodel.findOneAndUpdate({uniqueId: output}, { $push: { joinedevents: event._id } },{upsert: true});
                if (user_exist == null) {
                    await new this.joinedeventsmodel(data2).save()

                }
                else {
                    await this.joinedeventsmodel.findOneAndUpdate({uniqueId: output}, { $push: { joinedevents: event._id } })
                }

                await this.communityModel.findByIdAndUpdate(communityId, { $push: { events: event._id } })
                await this.conversationPubSubModel.findByIdAndUpdate(event._id, { $addToSet: { subscribers: creatorId } }, { upsert: true }); 

            }
            catch (err) {
                console.log(err);
                return err;

            }
        }
    }

    async joinEvent(communityId: ObjectId, userId: string, eventId: string): Promise<any> {
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        console.log(user);
        const community = await this.communityModel.findById(communityId);
        console.log(community);
        if (!user) {
            throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);
        }

        if (!community) {
            throw new HttpException('The community does not exist', HttpStatus.NOT_FOUND);

        }
        const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
        console.log(event)
        const eventCheck = await this.communityModel.findOne({ _id: communityId, events: { $in: [event._id] } })
        if (!eventCheck) {
            throw new HttpException('This event dosent exist in the community', HttpStatus.NOT_FOUND)
        }

        const isMemberExistInCommunity = await this.communityMemberModel.find({ _id: communityId, members: { $in: [user._id] } })
        if (!isMemberExistInCommunity) {
            throw new Error(`User with id ${userId} has not joined the community ${communityId}`)
        }
        else {
            try {

                // const output = createId(communityId, userId)
                const output = userId + communityId;

                //     const id =  userId + communityId
                //     console.log(id)
                //     const bytes = Buffer.from(id,'hex')
                //    const hash_object =  createHash('sha256')
                //    hash_object.update(bytes);
                //    const output_bytes =  hash_object.digest();
                //    const output_str = output_bytes.toString('hex').slice(40)

                //     console.log(output_str)

                //     const output = new mongoose.Types.ObjectId(output_str) 
                const data = {
                    uniqueId: output,
                    userId:userId,
                    joinedevents: [eventId]
                }

                console.log("output", output)

                // const event = await this.eventsmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId))
                // event.totalMembers = event.totalMembers + 1;
                await this.eventsmodel.findByIdAndUpdate(
                    new mongoose.Types.ObjectId(eventId),
                    { $inc: { totalMembers: 1 } }
                  );
                  
                // await event.save()

                await this.conversationPubSubModel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), { $addToSet: { subscribers: userId } }, { upsert: true }); 
                await this.eventmembersmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), { $push: { members: user._id } })
                // await this.joinedeventsmodel.findOneAndUpdate({unqiqueId:output}, { $push: { joinedevents: event._id } },{upsert: true});
                const newuser = await this.joinedeventsmodel.findOne({uniqueId:output})
                if (!newuser) {
                    await new this.joinedeventsmodel(data).save();
                }
                else {

                    return await this.joinedeventsmodel.findOneAndUpdate({unqiqueId:output}, { $push: { joinedevents: event._id } })

                }
                


            }
            catch (error) {
                console.log(error);
                return error;
            }

        }




    }


    async getMyEvents(communityId: ObjectId, userId: string): Promise<any> {
        const community = await this.communityModel.findById(communityId);
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        if (!user) {
            throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);
        }

        if (!community) {
            throw new HttpException("Community Dosent Exist", HttpStatus.NOT_FOUND);
        }
        else {
            try {
                // const output = createId(communityId, userId);
                const output = userId + communityId;
                const event = await this.joinedeventsmodel.findOne({uniqueId:output}).populate('joinedevents')
                // if (!event) {
                //     // throw new HttpException("Events not found", HttpStatus.NOT_FOUND);
                //  return [];
                // }
                return event;



            }
            catch (err) {
                console.log(err);
                return err;

            }

        }

    }

    async updateEventById(dto: EventsDto, eventId: string): Promise<any> {
        //     const community = await this.communityMemberModel.findById(communityId);
        // console.log(community);
        const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));

        if (!event) {
            throw new HttpException('This event dosent exist', HttpStatus.NOT_FOUND)

        }
        else {
            try {
                const data = {
                    name: dto.name,
                    description: dto.description,
                    location: dto.location,
                    imgURL: dto.imgURL,


                }
                console.log(data.name)
                console.log(typeof (data.name))

                return await this.eventsmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), { $set: { description: data.description, name: data.name, imgURL: data.imgURL, location: data.location } })


            } catch (error) {
                console.log(error);
                return error;

            }
        }

        // await this.eventsmodel.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {$push: {name: data}}) //description: data.description, location: data.description, imgURL: data.imgURL//
    }

    async getEventsByCommunityId(communityId: ObjectId, userId: string): Promise<any> {
        const user_id = new mongoose.Types.ObjectId(userId)
        // const ouput = createId(communityId, userId);

        const output = userId + communityId;
        const allevents = (await this.communityModel.findById(communityId).populate({path: 'events', populate:{path:'creatorId', select: '_id name avatarURL'}}));


        var myevents = await this.getMyEvents(communityId, userId);
        console.log('my events ',myevents)
        myevents =myevents? myevents.joinedevents:[];
        // console.log(myevents.joinedevents)
        var exploreList = []
        //TODO: remove myEvent wehn everything finalisre
        var myeventsList = []
        // console.log("=========================");
        // console.log(myevents);


        for (var alleventsIndex = 0; alleventsIndex < allevents.events.length; alleventsIndex++) {
            //    console.log(allevents.events.at(alleventsIndex)['_id'],myevents.length);
            var found = false;
            for (var myeventsIndex = 0; myeventsIndex < myevents.length; myeventsIndex++) {
                if (myevents.at(myeventsIndex)["_id"].equals(allevents.events.at(alleventsIndex)['_id'])) {
                    found = true;
                    break;
                }

            }
            if (!found) {
                exploreList.push(allevents.events.at(alleventsIndex));
            }
            else {
                myeventsList.push(allevents.events.at(alleventsIndex));
            }
        }
        console.log(exploreList.length, myeventsList.length, allevents.events.length)
        // const result = allevents.events.filter(a => !myevents.find((b: => a.name === b.name))
        //     allevents.events.filter(itemA => !myevents.some(itemB => itemA._id === itemB._id))

        //   
        //   console.log(result)








        // for(const event in allevents)
        // {
        //     console.log(event)
        //     for(const e in myevents.joinedevents)
        //     {
        //         if(event!= e)
        //         {
        //             explore.push(event);

        //         }

        //     }

        // }
        //  console.log(explore)

        const res = {
            'myevents': myeventsList,
            'explore': exploreList
        }
        return res
    }

    async deleteEventById(communityId: ObjectId, userId: string, eventId: string): Promise<any> {
        const id = new mongoose.Types.ObjectId(eventId)
        const user_id = new mongoose.Types.ObjectId(userId)

        const community = await this.communityMemberModel.findById(communityId);
        const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
        console.log('eventId ',eventId)
        // console.log(community);
        const creator = await this.userModel.findById(user_id);
        // console.log(creator);


        const isMemberExistInCommunity = await this.communityMemberModel.findOne({ _id: communityId, members: { $in: [creator._id] } })
        
        if(event && event.creatorId.toString()!=userId){
            throw new Error(`User is not the admin of the event`)
        }
        // console.log(isMemberExistInCommunity)

        if (!community) {
            throw new Error(`community with id ${communityId} not found`)

        }

        if (!creator) {
            throw new Error(`creator with id ${userId} not found`)
        }

        if (!isMemberExistInCommunity) {
            throw new Error(`User with id ${userId} has not joined the community ${communityId}`)
        }

        const eventCheck = await this.communityModel.findOne({ events: { $in: [event._id] } })
        
        console.log(eventCheck)

        if (!eventCheck) {
            throw new HttpException('This event dosent exist in the community', HttpStatus.NOT_FOUND)
        }
        else {
            const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
            const event_members = (await this.eventmembersmodel.findById(event._id)).members
            console.log("helloo again")
            console.log(event_members)

            for (var e = 0; e < event_members.length; e++) {
                console.log(event_members.at(e));
                const output =  String(event_members.at(e))+communityId;
                console.log('output ',output)
                await this.joinedeventsmodel.findOneAndUpdate({uniqueId:output}, { $pull: { joinedevents: event._id } })
                console.log("delete from joined event succesfull")
            }
            console.log("deleting event members")
            await this.eventmembersmodel.findByIdAndDelete(event._id)
            console.log("deleteing from community model")
            await this.communityModel.findByIdAndUpdate(community._id, { $pull: { events: event._id } })
            console.log("deleting event model")
            await this.eventsmodel.findByIdAndDelete(event._id)
        }

    }

    //TODO: CHECK IF SOMEONE IS PART OF THE EVENT OR COMMUNITY OR NOT

    async checkIfTheUserExistEvent(communityId: ObjectId, userId: string, eventId: string) {
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        console.log(user);
        const community = await this.communityModel.findById(communityId);
        console.log(community);
        if (!user) {
            throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);
        }

        if (!community) {
            throw new HttpException('The community does not exist', HttpStatus.NOT_FOUND);

        }
        const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
        console.log(event)
        const eventCheck = await this.communityModel.findOne({ _id: communityId, events: { $in: [event._id] } })
        if (!eventCheck) {
            throw new HttpException('This event dosent exist in the community', HttpStatus.NOT_FOUND)
        }

        const member = await this.communityMemberModel.findOne({ _id: communityId, members: { $in: [user._id] } })
        if (!member) {
            throw new Error(`User with id ${userId} has not joined the community ${communityId}`)
        }



        // const output = createId(communityId, userId)
        const output = userId + communityId;
        const checkEvent = await this.joinedeventsmodel.find({uniqueId: output, joinedevents: { $in: [new mongoose.Types.ObjectId(eventId)] } })
        console.log(checkEvent)

        var present = true
        if (checkEvent.length == 0) {
            present = false
        }
        return present;


    }
    async leaveEvent(communityId: ObjectId, userId: string, eventId: string): Promise<any> {
        var present = this.checkIfTheUserExistEvent(communityId, userId, eventId)
        if (present) {
            // const output = createId(communityId, userId)
            const output = userId + communityId;
            await this.eventsmodel.findByIdAndUpdate(eventId,{$inc:{totalMembers :-1}})
            await this.eventmembersmodel.findByIdAndUpdate(eventId, { $pull: { members: new mongoose.Types.ObjectId(userId) } })
            await this.joinedeventsmodel.findOneAndUpdate({uniqueId: output}, { $pull: { joinedevents: eventId } })
            const updatedConversation = await this.conversationPubSubModel.findByIdAndUpdate(eventId, { $pull: { subscribers:userId } }, { new: true, select: 'subscribers' });
        if (!updatedConversation || updatedConversation.subscribers.length === 0) {
            await this.conversationPubSubModel.deleteOne({ groupId: eventId });
    }
        }
        else {
            throw new Error(`User with id ${userId} dosent exist`)

        }

    }
    async getUserByEvents(communityId: ObjectId, eventId: string): Promise<any> {
        const community = await this.communityModel.findById(communityId);
        if (!community) {
            throw new HttpException('The community does not exist', HttpStatus.NOT_FOUND);

        }
        const event = await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId));
        console.log(event)
        const eventCheck = await this.communityModel.findOne({ _id: communityId, events: { $in: [event._id] } })

        if (!eventCheck) {
            throw new HttpException('This event dosent exist in the community', HttpStatus.NOT_FOUND)
        }

        const members = (await this.eventmembersmodel.findById(event._id)).populate('members')
        console.log(members)

        return members;

    }

    async getEventById(eventId: string): Promise<Event[]>
    {
        try {
            return (await this.eventsmodel.findById(new mongoose.Types.ObjectId(eventId)));

        }
        catch (error) {
            console.log('This event dosent exist');
            return error;
        }


    }


}







function createId(communityId: ObjectId, userId: string): any {
    const id = userId + communityId
    console.log(id)
    const bytes = Buffer.from(id, 'hex')
    const hash_object = createHash('sha256')
    hash_object.update(bytes);
    const output_bytes = hash_object.digest();
    const output_str = output_bytes.toString('hex').slice(40)

    console.log(output_str)

    const output = new mongoose.Types.ObjectId(output_str)

    return output;

}

