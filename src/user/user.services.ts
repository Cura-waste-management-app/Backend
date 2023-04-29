import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Location, locationDocument } from "src/schemas/location.schema";
import { User, userDocument } from "src/schemas/user.schema";
import { UserDto } from "./dto";
import { UCI, uciDocument } from "src/schemas/uciCode.schema";
import { locationError, nameError, uciError, userError } from "src/error_messages";
import { FirebaseUID, firebaseUidDocument } from "src/schemas/firebaseUid.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<userDocument>,
        @InjectModel(Location.name) private locationModel: Model<locationDocument>,
        @InjectModel(UCI.name) private uciModel: Model<uciDocument>,
        @InjectModel(FirebaseUID.name) private firebaseUIDModel: Model<firebaseUidDocument>) { }

    async addUser(dto: UserDto): Promise<any> {
        try {

            // check if user name exists
            const nameExists = await this.userModel.exists({ name: dto.name }).collation({
                locale: 'en',
                strength: 2
            });
            if (nameExists != null) {
                throw new HttpException(nameError, HttpStatus.CONFLICT);
            }

            // verify uci code if user is NGO or Restaurant
            if (dto.role == "NGO" || dto.role == "Restaurant") {

                const validUci = await this.uciModel.exists({ entityName: dto.name, uciCode: dto.uciCode }).
                    collation({
                        locale: 'en',
                        strength: 2
                    });

                if (validUci == null) {
                    throw new HttpException(uciError, HttpStatus.BAD_REQUEST);
                }
                else {
                    console.log("deleteing uci");
                    await this.uciModel.deleteOne({ _id: validUci._id });
                }
            }

            const locationData = JSON.parse(dto.location);
            const locationObj = await new this.locationModel(locationData).save();

            const userData = {
                name: dto.name,
                role: dto.role,
                emailID: dto.emailID,
                location: locationObj._id
            }

            const user = await new this.userModel(userData).save();

            // link mongoose uid with firebase uid
            const firebaseUser = await new this.firebaseUIDModel({ _id: dto.uid, mongooseUID: user._id }).save();
            // console.log(firebaseUser);

            return user;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getUserByFirebaseUID(firebaseUid: string): Promise<any> {

        try {
            const firebaseUser = await this.firebaseUIDModel.findById(firebaseUid);
            if (firebaseUser == null) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }
            return await this.userModel.findById(firebaseUser.mongooseUID);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getUserInfo(uid: ObjectId): Promise<any> {

        try {
            const user = await this.userModel.findById(uid);
            if (user == null) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }
            return user;
        }
        catch (err) {
            throw err;
        }
    }

    async updateUser(dto: UserDto): Promise<any> {

        try {
            const user = await this.userModel.findById(dto.uid, 'location');
            if (!user) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }
            const locationData = JSON.parse(dto.location);
            const locationObj = await this.locationModel.findByIdAndUpdate(user.location, locationData);
            if (locationObj == null) {
                throw new HttpException(locationError, HttpStatus.NOT_FOUND);
            }

            await this.userModel.findByIdAndUpdate(dto.uid, {
                role: dto.role,
                name: dto.name,
                avatarURL: dto.avatarURL,
                emailID: dto.emailID,
            });

            return user;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async addUCI(name: string) {

        try {
            const code = Math.floor(100000 + Math.random() * 900000);
            const doc = await new this.uciModel({ entityName: name, uciCode: code }).save();
            return doc;
        }
        catch (err) {
            throw err;
        }

    }

}