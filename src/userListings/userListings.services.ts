import mongoose, { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";
import { ListingDto } from "./dto";
import { Location, locationDocument } from "src/schemas/location.schema";
import '../error_messages';

@Injectable()
export class UserListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>,
        @InjectModel(Location.name) private locationModel: Model<locationDocument>,) { }

    async getListings(uid: ObjectId): Promise<any> {

        try {
            console.log(uid);
            const user = await this.userModel.exists({ _id: uid });
            if (user == null) {
                throw new HttpException(userError, HttpStatus.NOT_FOUND);
            }
            var listingsDoc = (await this.userModel.findById(uid).populate({ path: 'itemsListed', populate: [{ path: 'location' }, {path:'owner', select:'name avatarURL'}] }));
            var listings = listingsDoc.itemsListed;

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

    async deleteListing(listingID: ObjectId, uid: ObjectId): Promise<any> {
        try {

            const listing = await this.listingModel.findById(listingID, 'requestedUsers');
            if (!listing) {
                throw new HttpException(listingError, HttpStatus.NOT_FOUND);
            }

            // remove listing from the user's itemsListed
            const doc = await this.userModel.findByIdAndUpdate(uid, { $pull: { itemsListed: listingID } });
            if (!doc) {
                throw new HttpException(listingError, HttpStatus.NOT_FOUND);
            }

            // remove listing from the requested user's itemsRequested
            for (var i = 0; i < listing.requestedUsers.length; i++) {
                await this.userModel.findByIdAndUpdate(listing.requestedUsers[i], { $pull: { itemsRequested: listingID } });
            }

            // remove listing from the listing collection
            await this.listingModel.deleteOne({ _id: listingID });
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async shareListing(listingID: ObjectId, sharedUserName: string): Promise<any> {

        try {
            const listing = await this.listingModel.exists({_id:listingID});
            if (listing == null) {
                throw new HttpException(listingError, HttpStatus.NOT_FOUND);
            }
            
            const sharedUser = await this.userModel.findOne({ 'name': sharedUserName }).collation({
                locale: 'en',
                strength: 2
            });
            if (!sharedUser)
                return "User does not exists!";

            // console.log(sharedUserID._id);
            const doc = await this.listingModel.updateOne({ _id: listingID },
                {
                    'status': 'Pending',
                    'sharedTimeStamp': new Date(),
                    'sharedUserID': sharedUser._id
                });

            if (!doc) {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
            else {
                console.log("listing updated: ", doc);
                return "Status of listing updated successfully!";
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async addListing(dto: ListingDto): Promise<any> {

        const locationData = JSON.parse(dto.location);
        const locationObj = await new this.locationModel(locationData).save();

        const data = {
            title: dto.title,
            description: dto.description,
            category: dto.category,
            postTimeStamp: new Date(),
            status: "Active",
            owner: new mongoose.Types.ObjectId(dto.ownerID),
            location: locationObj._id,
            imagePath: dto.imagePath
        }
        // console.log(data);


        try {
            const listing = await new this.listingModel(data).save();

            await this.userModel.findByIdAndUpdate(dto.ownerID, { $push: { itemsListed: listing._id } });

        }
        catch (err) {
            console.log(err);
            return err;
        }

    }


    // just to add dummy data
    async create(): Promise<any> {
        const uid = new mongoose.Types.ObjectId(2);
        var now = new Date();

        const locationData = {

            street: "xyz",
            city: "xyz",
            state: "Punjab",
            postalCode: "140107",
            longitude: 33.45,
            latitude: 70.45
        };
        const location = await new this.locationModel(locationData).save();
        const data1 = {
            status: "Active",
            title: "Black Jacket",
            description: "Perfect for chilling winters!",
            owner: uid,
            location: location._id,
            category: "Clothing",
            postTimeStamp: Date(),

            requests: 10,
            likes: 11,

            imagePath: 'assets/images/jacket.jpg'
        };

        const data2 = {
            status: "Shared",
            title: "Wooden chair",
            description: "new chair, no cracks",
            owner: uid,
            location: location._id,
            category: "Furniture",
            postTimeStamp: Date(),
            sharedTimeStamp: Date(),
            requests: 9,
            likes: 7,

            imagePath: 'assets/images/chair.jpg'
        };

        var listing1 = new this.listingModel(data1);
        listing1 = await listing1.save();
        var listing2 = new this.listingModel(data2);
        listing2 = await listing2.save();


        console.log(listing1);
        // always pass object as the argument of model while creating instance
        const user = new this.userModel({ _id: uid, name: 'Rohit', itemsListed: [listing1._id, listing2._id], role: "Individual", location: location._id });
        return user.save();
    }
}

