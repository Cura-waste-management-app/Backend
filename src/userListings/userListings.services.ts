import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";

@Injectable()
export class UserListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>) { }


    async getUserListings(): Promise<any> {

        try {
            const uid = "1";
            var listingsDoc = await this.userModel.findById(uid, 'itemsListed');
            var listingsIds = listingsDoc.itemsListed;
            
            //never use asyn/await with callbacks
            if (!listingsIds) {
                throw new HttpException('The user have not listed anything yet!', HttpStatus.NOT_FOUND);
            }
            else {
                var listings = [];

                for(const listingId of listingsIds)
                {
                    const listing = await this.listingModel.findById(listingId);           
                    listings.push(listing);
                    console.log("1");
                }
                // listingsIds.forEach(async (listingId, idx) =>{                   
                //     const listing = await this.listingModel.findById(listingId);           
                //     listings.push(listing);
                //     console.log(idx);
                  
                // });
                console.log("ok");
                return listings;
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }
    };

    async deleteListing(listingID: string): Promise<any> {
        try {
            const uid = "1";
            const doc = await this.userModel.findByIdAndUpdate(uid, { $pull: { itemsListed: listingID } });
            if (!doc) {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
            else {
                // await this.listingModel.deleteOne({_id: listingID});

                console.log("listing deleted: ", doc);
                return "listing deleted successfully";
            }

        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async shareListing(listingID: string): Promise<any> {
        const uid = "1";
        try {
            const doc = await this.listingModel.updateOne({ _id: listingID }, { 'status': 'shared' });
            if (!doc) {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
            else
                return "Status of listing updated successfully!";
        }

        catch (err) {
            console.log(err);
            return err;
        }
    }

    async create(): Promise<any> {

        const data1 = {
            status: "Active",
            name: "Black Jacket",
            description: "Perfect for chilling winters!",
            ownerID: "1",
            location: "Chandigarh",
            category: "Clothing", 
            postDate: Date.now(),
            requests: 10,
            likes: 11,
            views: 100,
            imgURL: 'assets/images/jacket.jpg'
        };

        const data2 = {
            status: "Shared",
            name: "Wooden chair",
            description: "new chair, no cracks",
            ownerID: "1",
            location: "Chandigarh",
            category: "Furniture", 
            postDate: "Tues, 17 Nov",
            sharedDate: Date.now(),
            requests: 9,
            likes: 7,
            views: 19,
            imgURL: 'assets/images/chair.jpg'
        };

        var listing1 = new this.listingModel(data1);
        listing1 = await listing1.save();
        var listing2 = new this.listingModel(data2);
        listing2 = await listing2.save();
        const uid = "1";
        console.log(listing1);
        // always pass object as the argument of model while creating instance
        const user = new this.userModel({_id: uid, name: 'Rohit Bajaj', itemsListed: [listing1._id, listing2._id]});
        return user.save();
    }
}

