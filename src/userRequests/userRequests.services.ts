import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";
import '../error_messages';
import { listingError, userError } from "../error_messages";

@Injectable()
export class UserRequestsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>) { }

    async addRequest(listingID: ObjectId, uid: ObjectId) {

        try {
            const user = await this.userModel.exists({ _id: uid });
            if (user == null) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }
            const listing = await this.listingModel.exists({ _id: listingID });
            if (listing == null) {
                throw new HttpException(listingError, HttpStatus.NOT_FOUND);
            }

            await this.listingModel.findByIdAndUpdate(listingID, { $push: { requestedUsers: uid } })
            return await this.userModel.findByIdAndUpdate(uid, { $push: { itemsRequested: listingID } });
        }
        catch (err) {
            console.log(err);
            throw err;
        }

    }

    async getUserRequests(uid: ObjectId): Promise<any> {

        try {
            const user = await this.userModel.exists({ _id: uid });
            if (user == null) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }

            var listingsDoc = (await this.userModel.findById(uid).populate(
                {
                    path: 'itemsRequested',
                    populate: [{ path: 'location' },
                    { path: 'owner', select: 'name avatarURL points' },
                    { path: 'requestedUsers', select: 'name' }]
                }));

            var listings = listingsDoc.itemsRequested;

            //never use asyn/await with callbacks
              return listings;          
        }

        catch (error) {
            console.log(error);
            throw error;
        }
    };

    async deleteRequest(listingID: ObjectId, uid: ObjectId): Promise<any> {
        try {
            const user = await this.userModel.exists({ _id: uid });
            if (user == null) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }
            const checkListing = await this.listingModel.exists({ _id: listingID });
            if (checkListing == null) {
                throw new HttpException(listingError, HttpStatus.NOT_FOUND);
            }

            await this.listingModel.findByIdAndUpdate(listingID, { $pull: { requestedUsers: uid } });
            const listing = await this.listingModel.findById(listingID);
            listing.requests = listing.requests - 1;
            await listing.save();
            const doc = await this.userModel.findByIdAndUpdate(uid, { $pull: { itemsRequested: listingID } });
            if (!doc) {
                throw new HttpException(listingError, HttpStatus.NOT_FOUND);
            }
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

    async ReceiveListing(listingID: ObjectId, uid: ObjectId): Promise<any> {

        try {
            const user = await this.userModel.exists({ _id: uid });
            if (user == null) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }
            const listingcheck = await this.listingModel.exists({ _id: listingID });
            if (listingcheck == null) {
                throw new HttpException(listingError, HttpStatus.NOT_FOUND);
            }

            const listing = await this.listingModel.findById(listingID, 'sharedUserID owner');

            if (!listing.sharedUserID || listing.sharedUserID.toString() != uid.toString())
                return "No confirmation from the sender!";
            else {
                const doc = await this.listingModel.updateOne({ _id: listingID },
                    {
                        'status': 'Shared'
                    });
                // console.log(doc);

                const receiver = await this.userModel.findById(uid, 'itemsReceived');
                await this.userModel.updateOne({ _id: uid },
                    {
                        'itemsReceived': receiver.itemsReceived + 1
                    });
                const sender = await this.userModel.findById(listing.owner, 'itemsShared');
                await this.userModel.updateOne({ _id: uid },
                    {
                        'itemsShared': sender.itemsShared + 1
                    });

                return "Item received!";
            }

        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }

}

