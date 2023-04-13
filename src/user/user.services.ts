import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId } from "mongoose";
import { Location, locationDocument } from "src/schemas/location.schema";
import { User, userDocument } from "src/schemas/user.schema";
import { UserDto } from "./dto";


@Injectable()
export class UserService{
    constructor(@InjectModel(User.name) private userModel: Model<userDocument>,
    @InjectModel(Location.name) private locationModel: Model<locationDocument>) { }

    async addUser(dto: UserDto): Promise<any>{

        const locationData = JSON.parse(dto.location);
        const locationObj = await new this.locationModel(locationData).save();
        const nameExists = await this.userModel.exists({name: dto.name}).collation({
            locale: 'en',
            strength: 2
          });
        // console.log(nameExists);
        if(nameExists != null)
        {
            return "Username already exists! Please try another username";
        }
        const userData = {
            _id: new mongoose.Types.ObjectId(dto.uid),
            name: dto.name,
            role: dto.role,
            emailID: dto.emailID,
            location: locationObj._id
        }

        const user = await new this.userModel(userData).save();
        return user;
    }

    async getUserInfo(uid: ObjectId): Promise<any>{

        const user = await this.userModel.findById(uid);
        if(user == null)
        {
            return "User does not exists";
        }
        return user;
    }

    async updateUser(dto: UserDto): Promise<any>{
        console.log("hello");
        const locationData = JSON.parse(dto.location);
        const locationObj = await new this.locationModel(locationData).save();

        const user = await this.userModel.findByIdAndUpdate(dto.uid, {
            role: dto.role,
            name: dto.name,
            avatarURL: dto.avatarURL,
            location: locationObj._id,
            emailID: dto.emailID,
            
        });

        // return user;
    }
    
}