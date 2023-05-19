import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { Community, communityDocument } from 'src/schemas/community.schema';
import { User, userDocument } from 'src/schemas/user.schema';
import { CommunityDto } from './dto/community.dto';
import { CommunityMember, CommunityMemberDocument } from 'src/schemas/community_members.schema';
import { JoinedCommunities, joinedCommunitiesDocument } from 'src/schemas/joined_communities.schema';
import { Events, eventDocument } from 'src/schemas/events.schema';
import { EventsService } from 'src/events/events.service';
import { EventMembers, eventMembersDocument } from 'src/schemas/eventMembers.schema';
import { ConversationPubSub, conversationPubSubDocument } from 'src/schemas/conversation_pubsub.schema';

@Injectable()
export class CommunityService {
    constructor(@InjectModel(Community.name) private communityModel: Model<communityDocument>, private eventService: EventsService, @InjectModel(User.name) private userModel: Model<userDocument>, @InjectModel(Events.name) private eventsModel : Model<eventDocument>, @InjectModel(ConversationPubSub.name) private conversationPubSubModel: Model<conversationPubSubDocument>,
        @InjectModel(CommunityMember.name) private communityMemberModel: Model<CommunityMemberDocument>, @InjectModel(JoinedCommunities.name) private joinedCommunitiesModel: Model<joinedCommunitiesDocument>, @InjectModel(EventMembers.name) private eventMembersModel: Model<eventMembersDocument>) { }



    async getCommunitiesByUserId(userId: string): Promise<any>
    {
        try{
            
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        if(!user)
        {
            throw new HttpException(`User doesn't exist ${userId}`, HttpStatus.NOT_FOUND);}
        else
        {
            const communityDoc = await this.joinedCommunitiesModel.findById(new mongoose.Types.ObjectId(userId)).populate('joinedCommunities');
            return communityDoc;

        }

    

        }
        catch (error) {
            console.log(error);
            return error;

        }

    };


 
    async getCommunitiesById(id: string): Promise<Community[]> {
        try {
            return (await this.communityModel.findById(id));

        }
        catch (error) {
            console.log(error);
            return error;
        }

    }

    async getCommunitiesByCategory(category: string): Promise<any> {
        try {
            const communityDoc = await this.communityModel.find({category: category});
            if (!communityDoc) {
                throw new HttpException("There are no communities", HttpStatus.NOT_FOUND);
            }
            else {
                return communityDoc;
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }
    };


    async getCommunitiesByName(name: string): Promise<Community[]> {
        try {
            const communityDoc = await this.communityModel.find({name: name});
            if (!communityDoc) {
                throw new HttpException("There are no communities", HttpStatus.NOT_FOUND);

            }
            else {
            
                return communityDoc;
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }

    }

    async getallCommunities(userId: ObjectId, @Query('offset') offset = 0, @Query('limit') limit = 10): Promise<Community[]> {
        const user = await this.userModel.findById(userId, 'role');
        // console.log("role - ", userDoc.role);
        if(user.role == "Individual")
        {    
            return await this.communityModel.find( { type: { $in:["Individual", "NGO"]} });
        }
        else
        return await this.communityModel.find();
    };

    async getUsersByCommunity(communityId: ObjectId): Promise<any> {
        const community = await this.communityModel.findById(communityId);

        if (!community) {
            throw new HttpException("Community Dosent Exist", HttpStatus.NOT_FOUND);
        }
        else {
            try {

                return await this.communityMemberModel.findById(communityId).populate('members', '_id name avatarURL');


                // const comm = await this.communityMemberModel.findById(communityId);
                // console.log(comm);
                // const data = {
                //     _id: communityId,
                // }

                // if(!comm)
                // {
                //     console.log("No Community Here");
                //     await new this.communityMemberModel(data).save();
                // }
                // else
                // {
                //     return await this.communityMemberModel.findById(communityId).populate('members');

                // }
            }

            catch (err) {
                console.log(err);
                return err;

            }

        }
    }


    async joinCommunity(userId: string, communityId: ObjectId): Promise<any> {
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        const community = await this.communityModel.findById(communityId);
        // console.log(userId, user, typeof (userId));
        if (!user) {
            throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);
        }

        if (!community) {
            throw new HttpException('The community does not exist', HttpStatus.NOT_FOUND);

        }
        else {
            try {
                // return await this.joinedCommunitiesModel.updateOne(
                //     {_id: userId,},
                //     {$push: JoinedCommunities}

                // )

                // const user = await this.joinedCommunitiesModel.findById(new mongoose.Types.ObjectId(userId));
                // console.log(user);
                // const data = {
                //     _id: userId,
                //     joinedCommunities: [communityId]
                // }
                // const community = await this.communityModel.findById(communityId);
                // community.totalParticipant = community.totalParticipant + 1;
                // await community.save()

                await this.communityModel.findByIdAndUpdate(
                    communityId,
                    { $inc: { totalParticipant: 1 } }
                  );
                  
                await this.conversationPubSubModel.findByIdAndUpdate(communityId, { $addToSet: { subscribers: userId } }, { upsert: true }); 
                const d1 = await this.communityMemberModel.findByIdAndUpdate(communityId, { $push: { members: userId } })
                // console.log(d1);
                await this.joinedCommunitiesModel.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), { $push: { joinedCommunities: community._id } },{upsert : true});
                // if (!user) {
                //     console.log("no user here")
                //     await new this.joinedCommunitiesModel(data).save();
                // }
                // else {

                //     // await this.communityMemberModel.findByIdAndUpdate(communityId, {$push:{members: new mongoose.Types.ObjectId(userId)}})


                //     return (await this.joinedCommunitiesModel.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), { $push: { joinedCommunities: community._id } }));


                //     //TODO: CHECK IF USER ALREADY EXIST THEN DONT UPDATE

                // }


            }
            catch (err) {
                console.log(err);
                return err;

            }


        }




    };
    async checkIfTheUserExistCommunity(communityId: ObjectId, userId: string) {
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        // console.log(user);
        const community = await this.communityModel.findById(communityId);
        // console.log(community);
        if (!user) {
            throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);
        }

        if (!community) {
            throw new HttpException('The community does not exist', HttpStatus.NOT_FOUND);

        }

        const member = await this.communityMemberModel.find({ _id: communityId, members: { $in: [user._id] } })
        var present = true
        if (!member) {
            // throw new Error('User with id ${creatorId} has not joined the community ${communityId}')
            present = false;
        }

        return present;


    }

    async leaveCommunity(communityId: ObjectId, userId: string): Promise<any> {
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))

        var present = this.checkIfTheUserExistCommunity(communityId, userId);
        if (present) {
            // const output = createId(communityId, userId)
            // const output = userId + communityId;
            await this.communityModel.findByIdAndUpdate(communityId, { $inc: { totalParticipant: -1 } })
            await this.communityMemberModel.findByIdAndUpdate(communityId, { $pull: { members: new mongoose.Types.ObjectId(userId) } })
            await this.joinedCommunitiesModel.findOneAndUpdate(user._id, { $pull: { joinedCommunities: communityId } })
            const updatedConversation = await this.conversationPubSubModel.findByIdAndUpdate(communityId, { $pull: { subscribers: userId } }, { new: true, select: 'subscribers' });
        if (!updatedConversation || updatedConversation.subscribers.length === 0) {
            await this.conversationPubSubModel.deleteOne({ groupId: communityId });
    }
    
        }
        else {
            throw new Error(`User with id ${userId} dosent exist`)

        }

    }

    async deleteCommunityById(communityId: ObjectId, userId: string): Promise<any> {
        const community = await this.communityModel.findById(communityId);
        if (!community) {
            throw new Error(`community with id ${communityId} not found`)
        }
        const creator = await this.communityModel.findOne({ _id: community._id, adminId: new mongoose.Types.ObjectId(userId) })

        if (!creator) {
            throw new Error(`User with id ${userId} not an admin`)


        }
        else {

            const members = (await this.communityMemberModel.findById(community._id)).members
            const events =  (await this.communityModel.findById(community._id)).events

            // console.log(events);
            events.forEach(async (event)=>
                await this.eventService.deleteEventById(communityId,userId,event.toString())
            )
            // await Promise.all(events.map(event =>
            //     this.eventService.deleteEventById(communityId, userId, event.toString())
            //   ));
            // await this.joinedCommunitiesModel.updateMany(
            //     { _id: { $in: members } },
            //     { $pull: { joinedCommunities: community._id } }
            //   );
            for (var c = 0; c < members.length; c++) {
                // console.log(members.at(c))
                await this.joinedCommunitiesModel.findByIdAndUpdate(members.at(c), { $pull: { joinedCommunities: community._id } })
            }
            await this.communityMemberModel.findByIdAndDelete(community._id)
            await this.communityModel.findByIdAndDelete(community._id)

        }


    }

    async updateCommunity(communityId: ObjectId, dto: CommunityDto, userId: string): Promise<any> {
        const community = await this.communityModel.findById(communityId);

         if (!community) {
            throw new Error(`community with id ${communityId} not found`)}
            
        const creator = await this.communityModel.findOne({_id: community._id, adminId: new mongoose.Types.ObjectId(userId)})

            if(!creator)
            {
                throw new Error(`User with id ${userId} not an admin`)
    
                
            }

        else {
            try {
                await this.communityModel.findByIdAndUpdate(communityId, {
                    name: dto.name,
                    description: dto.description,
                    category: dto.category,
                    location: dto.location,
                    imgURL: dto.imgURL
                })

            }
            catch (e) {

                console.log(e);
                return e;
            }
        }

    }


    async addNewCommunity(dto: CommunityDto, userId: string): Promise<Community> {
      
        const admin = await this.userModel.findById(new mongoose.Types.ObjectId(userId));

        if (!admin) {
            throw new Error(`Admin with id ${userId} not found `)

        }

        const data = {
            name: dto.name,
            description: dto.description,
            category: dto.category,
            location: dto.location,
            totalParticipant: 1,
            adminId: admin._id,
            imgURL: dto.imgURL,
            type: admin.role
        }
        try {
            const community = await new this.communityModel(data).save();
            const communityMemberData = {
                _id: community._id,
                members: [admin._id]

            }

            // const data2 = {
            //     _id: admin._id,
            //     community: [community._id]
            // }
            await new this.communityMemberModel(communityMemberData).save()
            await this.conversationPubSubModel.findByIdAndUpdate(community._id, { $addToSet: { subscribers: userId } }, { upsert: true }); 
            await this.joinedCommunitiesModel.findOneAndUpdate({ _id: admin._id }, { $push: { joinedCommunities: community._id } },{upsert:true});
            // const user_exist = await this.joinedCommunitiesModel.exists({ _id: new mongoose.Types.ObjectId(userId) })
            // if (user_exist == null) {
            //     await new this.joinedCommunitiesModel(data2).save()
            // }
            // else {
            //     await this.joinedCommunitiesModel.findOneAndUpdate({ _id: admin._id }, { $push: { joinedCommunities: community._id } })

            // }

            return community;


        }
        catch (err) {
            console.log(err);
            return err;

        }
    };


    // async joinNewCommunity(userId: string): Promise<Community> {

    // }

}
