import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { userListings, userListingsDocument } from "../schemas/userLlistings.schema";

@Injectable()
export class UserListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(userListings.name) private userListingsModel: Model<userListingsDocument>) { }


    async getUserListings(): Promise<userListings> {

        try {
            const uid = "1";
            var listings = await this.userListingsModel.findById(uid);
            //never use asyn/await with callbacks
            if (!listings) {
                throw new HttpException('The user have not listed anything yet!', HttpStatus.NOT_FOUND);
            }
            else
                return listings;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    };
    
    async deleteListing(listingID: string): Promise<any> {
        try{
            const uid = "1";
            const doc = await this.userListingsModel.findByIdAndUpdate(uid, {$pull: {listings:{_id: listingID}}});
            if(!doc)
            {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
            else
            {
                console.log("listing deleted: ", doc);
                return "listing deleted successfully";
            }
            
        }
        catch(err)
        {
            console.log(err);
            return err;
        }
    }
    
    async shareListing(listingID: string): Promise<any> {
        const uid = "1";
        try{
            const doc = await this.userListingsModel.updateOne({_id: uid, 'listings._id': listingID}, {'listings.$.status': 'shared'});
            if(!doc)
            {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND); 
            }
            else
            return "Status of listing updated successfully!";
        }

        catch(err)
        {
            console.log(err);
            return err;
        }
    }

    async create(): Promise<userListings> {

        const data1 = {
            status: "Active",
            name: "Black Jacket",
            description: "Perfect for chilling winters!",
            postDate: "Tues, 17 Nov",
            requests: 10,
            likes: 11,
            views: 100,
            imgURL: 'assets/images/jacket.jpg'
        };

        const data2 = {
            status: "Shared",
            name: "Wooden chair",
            description: "new chair, no cracks",
            postDate: "Tues, 17 Nov",
            requests: 9,
            likes: 7,
            views: 19,
            imgURL: 'assets/images/chair.jpg'
        };

        const listing1 = new this.listingModel(data1);
        const listing2 = new this.listingModel(data2);
        const uid = "1";

        // always pass object as the argument of model while creating instance
        const userListings = new this.userListingsModel({ _id: uid, listings: [listing1, listing2] });
        return userListings.save();
    }
}

