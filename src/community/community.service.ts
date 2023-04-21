import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model,  ObjectId } from 'mongoose';
import { Community, communityDocument } from 'src/schemas/community.schema';
import { User, userDocument } from 'src/schemas/user.schema';
import { CommunityDto } from './dto/community.dto';
import { CommunityMember, CommunityMemberDocument } from 'src/schemas/community_members.schema';
import { JoinedCommunities, joinedCommunitiesDocument } from 'src/schemas/joined_communities.schema';

@Injectable()
export class CommunityService {
    constructor(@InjectModel(Community.name) private communityModel: Model<communityDocument>,  @InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(CommunityMember.name) private communityMemberModel: Model<CommunityMemberDocument>, @InjectModel(JoinedCommunities.name) private joinedCommunitiesModel: Model<joinedCommunitiesDocument>)
    {    }


    async getCommunitiesByUserId(userId: string): Promise<any>
    {
        try{
            
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        if(!user)
        {
            throw new HttpException(`User doesn't exist ${userId}`, HttpStatus.NOT_FOUND);        }
        else
        {
            const communityDoc = await this.joinedCommunitiesModel.findById(new mongoose.Types.ObjectId(userId)).populate('joinedCommunities');
            return communityDoc;

        }



        }

        catch(error)
        {
            console.log(error);
            return error;

        }
        
    };

    async getCommunitiesById(id:string): Promise<Community[]> 
    {
        try
        {
           return await this.communityModel.findById(id);
        }
        catch(error)
        {
            console.log(error);
            return error;
        }

     }

    async getCommunitiesByCategory(category: string): Promise<any>
    {
        try
        {
            const communityDoc = await this.communityModel.find().exec();
            if(!communityDoc)
            {
                throw new HttpException("There are no communities", HttpStatus.NOT_FOUND);

            }
            else
            {
                var communities = [];

                for(const community of communityDoc)
                {
                    if(community.category == category)
                    {
                        communities.push(community);
                    }
                }
                return communities;
            }
        }
        catch(error)
        {
            console.log(error);
            return error;
        }
    };


    async getCommunitiesByName(name:string): Promise<Community[]> 
    {
        try
        {
            const communityDoc = await this.communityModel.find().exec();
            if(!communityDoc)
            {
                throw new HttpException("There are no communities", HttpStatus.NOT_FOUND);

            }
            else
            {
                var communities = [];

                for(const community of communityDoc)
                {
                    if(community.name == name)
                    {
                        communities.push(community);
                    }
                }
                return communities;
            }
        }
        catch(error)
        {
            console.log(error);
            return error;
        }

     }
     

     
    

    async getallCommunities(@Query('offset') offset =0, @Query('limit')limit =10) : Promise<Community[]>
    {
        const communities = await this.communityModel.find().skip(+offset).limit(+limit).exec();
        return communities;
    };


    async getUsersByCommunity(communityId: ObjectId): Promise<any>
    {
        const community = await this.communityModel.findById(communityId);

        if(!community)
        {
            throw new HttpException("Community Dosent Exist", HttpStatus.NOT_FOUND);
        }
        else
        {
            try
            {

             return await this.communityMemberModel.findById(communityId).populate('members','_id name avatarURL');
             
             
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
            
            catch(err)
            {
                console.log(err);
                return err;

            }

        }
    }


    async joinCommunity(userId: string, communityId: ObjectId): Promise<any>
    {
        const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId))
        const community = await this.communityModel.findById(communityId);
        console.log(userId,user, typeof(userId));
        if(!user)
        {
            throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);    
        }

        if(!community)
        {
            throw new HttpException('The community does not exist', HttpStatus.NOT_FOUND);

        }
        else
        {
            try{
                // return await this.joinedCommunitiesModel.updateOne(
                //     {_id: userId,},
                //     {$push: JoinedCommunities}

                // )
                 
              const user=await this.joinedCommunitiesModel.findById(new mongoose.Types.ObjectId(userId));
              console.log(user);
              const data = {
                _id: userId,
                joinedCommunities: [communityId]
              }
              const community = await this.communityModel.findById(communityId);
              community.totalParticipant = community.totalParticipant + 1;
              await community.save()

              const d1 = await this.communityMemberModel.findByIdAndUpdate(communityId, {$push: {members: userId}})
              console.log(d1);

              if(!user){
                console.log("no user here")
              await new  this.joinedCommunitiesModel(data).save();
              }
              else
              {

                // await this.communityMemberModel.findByIdAndUpdate(communityId, {$push:{members: new mongoose.Types.ObjectId(userId)}})
                

                return (await this.joinedCommunitiesModel.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {$push: {joinedCommunities: community._id}}));


                   //TODO: CHECK IF USER ALREADY EXIST THEN DONT UPDATE

              }
               

            }
            catch(err)
            {
                console.log(err);
                return err;

            }


        }

        


    };
    async checkIfTheUserExistCommunity(communityId: ObjectId, userId: string) {
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
            await this.communityModel.findByIdAndUpdate(communityId,{$inc:{totalParticipant :-1}})
            await this.communityMemberModel.findByIdAndUpdate(communityId, { $pull: { members: new mongoose.Types.ObjectId(userId) } })
            await this.joinedCommunitiesModel.findOneAndUpdate( user._id , { $pull: { joinedCommunities: communityId }} )
        }
        else {
            throw new Error('User with id ${userId} dosent exist')

        }

    }

    async deleteCommunityById(communityId: ObjectId, userId: string): Promise<any>
    {
        const community = await this.communityModel.findById(communityId);
         if (!community) {
            throw new Error('community with id ${communityId} not found')}
        const creator = await this.communityModel.find({_id: community._id, adminId: new mongoose.Types.ObjectId(userId)})

        if(!creator)
        {
            throw new Error('User with id ${userId} not an admin')

            
        }
        else
        {
            const members = (await this.communityMemberModel.findById(community._id)).members
            for(var c = 0;c<members.length;c++)
            {
                console.log(members.at(c))
                await this.joinedCommunitiesModel.findByIdAndUpdate( members.at(c) , {$pull: {joinedCommunities: community._id}})
            }
            await this.communityMemberModel.findByIdAndDelete(community._id)
            await this.communityModel.findByIdAndDelete(community._id)

        }
            

    }



    async addNewCommunity(dto: CommunityDto, userId: string): Promise<Community>
    {

        const admin = await this.userModel.findById(new mongoose.Types.ObjectId(userId));

        const uid = "1";

        if(!admin)
        {
            throw new Error('Admin with id ${userId} not found ')

        }

        const data = {
            name: dto.name,
            description: dto.description,
            category: dto.category,
            location: dto.location,
            totalParticipant: 1,
            adminId: admin,
            imgURL: dto.imgURL,
            

        }
        try
        {
            const community = await new this.communityModel(data).save();
            const data1 = {
                _id: community._id,
                members: [admin._id]
                
            }

            const data2 = {
                _id: admin._id,
                community: [community._id]
            }
            await new this.communityMemberModel(data1).save()
            const user_exist = await this.joinedCommunitiesModel.exists({_id: new mongoose.Types.ObjectId(userId)})
            if(user_exist == null )
            {
                await new this.joinedCommunitiesModel(data2).save()
            }
            else
            {
                await this.joinedCommunitiesModel.findOneAndUpdate({_id: admin._id}, {$push:{ joinedCommunities: community._id}})

            }

            return community;
            
            
        }
        catch(err)
        {
            console.log(err);
            return err;
            
        }
    };



   

    // async joinNewCommunity(userId: string): Promise<Community> {
        
    // }
    
}
