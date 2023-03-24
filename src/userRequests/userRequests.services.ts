import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";

@Injectable()
export class UserRequestsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>) { }

    async addRequest(listingID: ObjectId, uid: ObjectId) {
        console.log(listingID, uid);
        try {
            await this.listingModel.findByIdAndUpdate(listingID, { $push: { requestedUsers: uid } })
            return await this.userModel.findByIdAndUpdate(uid, { $push: { itemsRequested: listingID } });
        }
        catch (err) {
            console.log(err);
            return err;
        }

    }

    async getUserRequests(uid: ObjectId): Promise<any> {

        try {
            var listingsDoc = await this.userModel.findById(uid).populate('itemsRequested');

            var listings = listingsDoc.itemsRequested;

            //never use asyn/await with callbacks
            if (!listings)
                throw new HttpException('The user have not listed anything yet!', HttpStatus.NOT_FOUND);
            else {
                return listings;
            }
        }

        catch (error) {
            console.log(error);
            return error;
        }
    };

    async deleteRequest(listingID: ObjectId, uid: ObjectId): Promise<any> {
        try {

            await this.listingModel.findByIdAndUpdate(listingID, { $pull: { requestedUsers: uid } });
            const doc = await this.userModel.findByIdAndUpdate(uid, { $pull: { itemsRequested: listingID } });
            if (!doc) {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async ReceiveListing(listingID: ObjectId, uid: ObjectId): Promise<any> {

        try {

            const listing = await this.listingModel.findById(listingID);
            if (!listing.sharedUserID || listing.sharedUserID != uid)
                return "No confirmation from the sender!";
            else {
                await this.listingModel.updateOne({ _id: listingID },
                    {
                        'status': 'Shared'
                    });
                return "Item received!";
            }


        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

}

