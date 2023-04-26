import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId } from "mongoose";
import { Location, locationDocument } from "src/schemas/location.schema";
import { User, userDocument } from "src/schemas/user.schema";
import { UserDto } from "./dto";
import { UCI, uciDocument } from "src/schemas/uciCode.schema";
import { userError } from "src/error_messages";
import { FirebaseUID, firebaseUidDocument } from "src/schemas/firebaseUid.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<userDocument>,
        @InjectModel(Location.name) private locationModel: Model<locationDocument>,
        @InjectModel(UCI.name) private uciModel: Model<uciDocument>,
        @InjectModel(FirebaseUID.name) private firebaseUIDModel: Model<firebaseUidDocument>) { }

    async addUser(dto: UserDto): Promise<any> {
        try{
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
                await this.uciModel.deleteOne({_id: validUci._id});
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

        // link mongoose uid with firebase uid
        const firebaseUser = await new this.firebaseUIDModel({_id: dto.uid, mongooseUID: user._id}).save();
        console.log(firebaseUser);

        return user;
    }
        catch(err)
        {
            console.log(err);
            return err;
        }
    }

    async getMongooseUID(firebaseUid: string): Promise<any>{

        const user = await this.firebaseUIDModel.findById(firebaseUid);
        if (user == null) {
            return new HttpException(userError, HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async getUserInfo(uid: ObjectId): Promise<any> {

        const user = await this.userModel.findById(uid);
        if (user == null) {
            return new HttpException(userError, HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async updateUser(dto: UserDto): Promise<any> {
        console.log("hello");
        try{

        
        const locationData = JSON.parse(dto.location);
        const locationObj = await new this.locationModel(locationData).save();
        if(!locationObj){
            throw new HttpException('No location found', HttpStatus.NOT_FOUND);
        }

        const user = await this.userModel.findByIdAndUpdate(dto.uid, {
            role: dto.role,
            name: dto.name,
            avatarURL: dto.avatarURL,
            location: locationObj._id,
            emailID: dto.emailID,

        });
        if(!user){
            throw new HttpException('No user found', HttpStatus.NOT_FOUND);
        }

            return user;
        }catch(err){
            console.log(err);
            return err;

        }
    }

    async addUCI(name: string)
    {
       
        const code  = Math.floor(100000 + Math.random() * 900000);
        const doc = await new this.uciModel({entityName: name, uciCode: code}).save();
        return doc;
    }

}