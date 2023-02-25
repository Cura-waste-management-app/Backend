import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community, communityDocument } from 'src/schemas/community.schema';
import { User, userDocument } from 'src/schemas/user.schema';

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


    
}
