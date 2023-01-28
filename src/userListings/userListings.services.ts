import { Model } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Listing, listingDocument } from "../schemas/listing.schema";
import { User, userDocument } from "../schemas/user.schema";
import { ListingDto } from "./dto";

@Injectable()
export class UserListingsService {
    constructor(@InjectModel(Listing.name) private listingModel: Model<listingDocument>,
        @InjectModel(User.name) private userModel: Model<userDocument>) { }


    async getListings(): Promise<any> {

        try {
            const uid = "1";
            var listingsDoc = await this.userModel.findById(uid, 'itemsListed');
            if (!listingsDoc)
                throw new HttpException("User doesn't exists!", HttpStatus.NOT_FOUND);

            var listingsIds = listingsDoc.itemsListed;

            //never use asyn/await with callbacks
            if (!listingsIds)
                throw new HttpException('The user have not listed anything yet!', HttpStatus.NOT_FOUND);
            else {
                var listings = [];

                for (const listingId of listingsIds) {
                    var listing = await this.listingModel.findById(listingId).lean();
                    listing['id'] = listing['_id'];
                    delete listing['_id'];
                    listings.push(listing);
                }

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
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async shareListing(listingID: string): Promise<any> {
        const uid = "1";
        try {
            var dateTime = new Date();
            var date = dateTime.getDate();
            var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
            const doc = await this.listingModel.updateOne({ _id: listingID },
                {
                    'status': 'shared',
                    'sharedDate': date,
                    'sharedTime': time
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

    async addListing(dto: ListingDto, file: Express.Multer.File): Promise<any> {

        const uid = "1";

        var dateTime = new Date();
            var date = dateTime.getDate();
            var time = dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();

        const data = {
            name: dto.name,
            description: dto.description,
            category: dto.category,
            postDate: date,
            postTime: time,
            status: "Active",
            ownerID: uid,
            location: dto.location,
            imgURL: file.filename      
        }

        try{
            const listing = await new this.listingModel(data).save();
            await this.userModel.findByIdAndUpdate(uid, { $push: { itemsListed: listing._id }});
        }
        catch(err)
        {
            console.log(err);
            return err;
        }
        
    }


//     // just to add dummy data
//     async create(): Promise<any> {

//         var now = new Date();
//         var date = now.toLocaleDateString();

//         const data1 = {
//             status: "Active",
//             name: "Black Jacket",
//             description: "Perfect for chilling winters!",
//             ownerID: "1",
//             location: "Chandigarh",
//             category: "Clothing",
//             postDate: date,
//             sharedDate: '900',
//             requests: 10,
//             likes: 11,
//             views: 100,
//             imgURL: 'assets/images/jacket.jpg'
//         };

//         const data2 = {
//             status: "Shared",
//             name: "Wooden chair",
//             description: "new chair, no cracks",
//             ownerID: "1",
//             location: "Chandigarh",
//             category: "Furniture",
//             postDate: date,
//             sharedDate: '900',
//             requests: 9,
//             likes: 7,
//             views: 19,
//             imgURL: 'assets/images/chair.jpg'
//         };

//         var listing1 = new this.listingModel(data1);
//         listing1 = await listing1.save();
//         var listing2 = new this.listingModel(data2);
//         listing2 = await listing2.save();
//         var l3 = await listing1.save();
//         var l4 = await listing2.save();
//         const uid = "1";
//         console.log(listing1);
//         // always pass object as the argument of model while creating instance
//         const user = new this.userModel({ _id: uid, name: 'Rohit Bajaj', itemsListed: [listing1._id, listing2._id, l3._id, l4._id] });
//         return user.save();
//     }
 }

