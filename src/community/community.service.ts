import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, communityDocument } from 'src/schemas/community.schema';
import { User, userDocument } from 'src/schemas/user.schema';
import { CommunityDto } from './dto/community.dto';

@Injectable()
export class CommunityService {
    constructor(@InjectModel(Community.name) private communityModel: Model<communityDocument>,  @InjectModel(User.name) private userModel: Model<userDocument>)
    {

       
    }
    async getCommunitiesByUserId(): Promise<any>
    {
        try{
            const uid = " "
        var communityDoc = await this.userModel.findById(uid)


        }

        catch(error)
        {
            console.log(error);
            return error;

        }
        
    };

    async getallCommunities() : Promise<Community[]>
    {
        return this.communityModel.find().exec();
    }

    async addNewCommunity(dto: CommunityDto, userId: string): Promise<Community>
    {

        const admin = await this.userModel.findById(userId);

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
    
}
