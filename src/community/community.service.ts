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
            throw new HttpException("User dosent exist", HttpStatus.NOT_FOUND);   
        }
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

    async getallCommunities(@Query('offset') offset =0, @Query('limit')limit =10) : Promise<Community[]>
    {
        const communities = await this.communityModel.find().skip(+offset).limit(+limit).exec();
        return communities;
    };


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
              if(!user){
                console.log("no user here")
              await new  this.joinedCommunitiesModel(data).save();
              }
              else
              {
                return (await this.joinedCommunitiesModel.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), {$push: {joinedCommunities: community._id}}).then((res)=>{
                    console.log(res,"in then");
                   }).catch(err=>console.log(err)))

              }
               

            }
            catch(err)
            {
                console.log(err);
                return err;

            }


        }

        


    };

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
            adminId: admin,
            imgURL: dto.imgURL

        }
        try
        {
            const community = await new this.communityModel(data)
            return community.save();
            
        }
        catch(err)
        {
            console.log(err);
            return err;
            
        }
    }

    // async joinNewCommunity(userId: string): Promise<Community> {
        
    // }
    
}