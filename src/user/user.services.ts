import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
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
    
}