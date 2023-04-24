import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId } from "mongoose";
import { Location, locationDocument } from "src/schemas/location.schema";
import { User, userDocument } from "src/schemas/user.schema";
import { UserDto } from "./dto";
import { UCI, uciDocument } from "src/schemas/uciCode.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<userDocument>,
        @InjectModel(Location.name) private locationModel: Model<locationDocument>,
        @InjectModel(UCI.name) private uciModel: Model<uciDocument>) { }

    async addUser(dto: UserDto): Promise<any> {

        // verify uci code if user is NGO or Restaurant
        if (dto.role == "NGO" || dto.role == "Restaurant") {
            // console.log(dto);           
            const validUci = await this.uciModel.exists({ entityName: dto.name, uciCode: dto.uciCode });
            if (validUci == null) {
                return "UCI code is not valid!";
            }
            else
            {   
                console.log("deleteing uci");
                return await this.uciModel.deleteOne({_id: validUci._id});
            }
        }
        
        const locationData = JSON.parse(dto.location);
        const locationObj = await new this.locationModel(locationData).save();
        const nameExists = await this.userModel.exists({ name: dto.name }).collation({
            locale: 'en',
            strength: 2
        });
        // console.log(nameExists);
        if (nameExists != null) {
            return "Username already exists! Please try another username";
        }
        const userData = {
            name: dto.name,
            role: dto.role,
            emailID: dto.emailID,
            location: locationObj._id
        }

        const user = await new this.userModel(userData).save();
        return user;
    }

    async getUserInfo(uid: ObjectId): Promise<any> {

        const user = await this.userModel.findById(uid);
        if (user == null) {
            return "User does not exists";
        }
        return user;
    }

    async updateUser(dto: UserDto): Promise<any> {
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

    async addUCI(name: string)
    {
       
        const code  = Math.floor(100000 + Math.random() * 900000);
        const doc = await new this.uciModel({entityName: name, uciCode: code}).save();
        return doc;
    }

}