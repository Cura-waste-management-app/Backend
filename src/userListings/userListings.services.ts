import mongoose, { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";
import { ListingDto } from "./dto";

@Injectable()
export class UserListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>) { }


    async getListings(uid: ObjectId): Promise<any> {

        try {          
            var listingsDoc = await this.userModel.findById(uid).populate('itemsListed');
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
            
            const listing = await this.listingModel.findById(listingID);
            if(!listing)
            {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
            await this.listingModel.deleteOne({_id: listingID});
            const doc = await this.userModel.findByIdAndUpdate(uid, { $pull: { itemsListed: listingID } });
            if (!doc) {
                throw new HttpException('No listing with given id present', HttpStatus.NOT_FOUND);
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async shareListing(listingID: ObjectId, sharedUserName: string): Promise<any> {
       
        try {
            const sharedUser = await this.userModel.findOne({'name': sharedUserName});
            if(!sharedUser)
            return "User does not exists!";

            // console.log(sharedUserID._id);
            const doc = await this.listingModel.updateOne({ _id: listingID },
                {
                    'status': 'Confirmation pending',
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

        const data = {
            title: dto.title,
            description: dto.description,
            category: dto.category,
           postTimeStamp: new Date(),
            status: "Active",
            owner: new mongoose.Types.ObjectId(dto.ownerID),
            location: dto.location,
            imagePath: dto.imagePath
        }

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
          

            const data1 = {
                status: "Active",
                title: "Black Jacket",
                description: "Perfect for chilling winters!",
                owner: uid,
                location: "Chandigarh",
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
                location: "Chandigarh",
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
            var l3 = await listing1.save();
            var l4 = await listing2.save();
          
            console.log(listing1);
            // always pass object as the argument of model while creating instance
            const user = new this.userModel({ _id: uid, name: 'Jhon', itemsListed: [listing1._id, listing2._id, l3._id, l4._id] });
            return user.save();
        }
}

